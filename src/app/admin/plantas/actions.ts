"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableText(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const value = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(value) ? value : fallback;
}

export async function createPlanta(formData: FormData) {
  await requireAdminAction();
  const bloqueId = text(formData, "bloqueId");
  const nombre = text(formData, "nombre");
  const imagenUrl = text(formData, "imagenUrl");
  if (!bloqueId || !nombre || !imagenUrl) throw new Error("Bloque, nombre e imagen/plano son obligatorios.");

  await prisma.planta.create({
    data: {
      bloqueId,
      nombre,
      codigo: nullableText(formData, "codigo"),
      nivel: intValue(formData, "nivel"),
      descripcion: nullableText(formData, "descripcion"),
      imagenUrl,
      observaciones: nullableText(formData, "observaciones"),
      orden: intValue(formData, "orden"),
    },
  });
  revalidatePath("/admin/plantas");
  revalidatePath("/bloques");
  redirect("/admin/plantas");
}

export async function updatePlanta(id: string, formData: FormData) {
  await requireAdminAction();
  const bloqueId = text(formData, "bloqueId");
  const nombre = text(formData, "nombre");
  const imagenUrl = text(formData, "imagenUrl");
  if (!bloqueId || !nombre || !imagenUrl) throw new Error("Bloque, nombre e imagen/plano son obligatorios.");

  await prisma.$transaction(async (tx) => {
    await tx.planta.update({
      where: { id },
      data: {
        bloqueId,
        nombre,
        codigo: nullableText(formData, "codigo"),
        nivel: intValue(formData, "nivel"),
        descripcion: nullableText(formData, "descripcion"),
        imagenUrl,
        observaciones: nullableText(formData, "observaciones"),
        activo: text(formData, "activo") === "true",
        orden: intValue(formData, "orden"),
      },
    });
    await tx.espacio.updateMany({ where: { plantaId: id }, data: { bloqueId } });
  });

  revalidatePath("/admin/plantas");
  revalidatePath("/admin/espacios");
  revalidatePath("/bloques");
  revalidatePath("/espacios");
  redirect("/admin/plantas");
}

export async function togglePlanta(id: string, activo: boolean) {
  await requireAdminAction();
  await prisma.planta.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/plantas");
  revalidatePath("/bloques");
}

export async function deletePlanta(id: string) {
  await requireAdminAction();
  const espacios = await prisma.espacio.count({ where: { plantaId: id } });
  if (espacios > 0) {
    await prisma.planta.update({ where: { id }, data: { activo: false } });
  } else {
    await prisma.planta.delete({ where: { id } });
  }
  revalidatePath("/admin/plantas");
  revalidatePath("/bloques");
}
