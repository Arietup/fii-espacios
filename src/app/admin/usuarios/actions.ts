"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }
  return session;
}

function readRole(value: FormDataEntryValue | null): "ADMIN" | "USER" {
  return value === "ADMIN" ? "ADMIN" : "USER";
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = readRole(formData.get("role"));

  if (!username || !name || password.length < 6) {
    throw new Error("Completa usuario, nombre y una contraseña de al menos 6 caracteres.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { username, name, passwordHash, role },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function saveUser(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("id") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = readRole(formData.get("role"));

  if (!username || !name) {
    throw new Error("Usuario y nombre son obligatorios.");
  }

  if (!userId && password.length < 6) {
    throw new Error("Completa una contrasena de al menos 6 caracteres.");
  }

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        name,
        role,
        ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
      },
    });
  } else {
    await prisma.user.create({
      data: {
        username,
        name,
        role,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function updateUser(userId: string, formData: FormData) {
  await requireAdmin();

  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = readRole(formData.get("role"));

  if (!username || !name) {
    throw new Error("Usuario y nombre son obligatorios.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      name,
      role,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  if (session.user.id === userId) {
    throw new Error("No puedes eliminar tu propio usuario.");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/usuarios");
}

export async function deleteUserFromForm(formData: FormData) {
  const userId = String(formData.get("id") ?? "");
  await deleteUser(userId);
  redirect("/admin/usuarios");
}
