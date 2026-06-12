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

export async function createUso(formData: FormData) {
  await requireAdminAction();
  const nombre = text(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio.");
  await prisma.usoEspacio.create({
    data: {
      nombre,
      descripcion: nullableText(formData, "descripcion"),
      orden: intValue(formData, "orden"),
    },
  });
  revalidatePath("/admin/usos");
  redirect("/admin/usos");
}

export async function updateUso(id: string, formData: FormData) {
  await requireAdminAction();
  const nombre = text(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio.");
  await prisma.usoEspacio.update({
    where: { id },
    data: {
      nombre,
      descripcion: nullableText(formData, "descripcion"),
      orden: intValue(formData, "orden"),
      activo: text(formData, "activo") === "true",
    },
  });
  revalidatePath("/admin/usos");
  redirect("/admin/usos");
}

export async function toggleUso(id: string, activo: boolean) {
  await requireAdminAction();
  await prisma.usoEspacio.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/usos");
}

export async function deleteUso(id: string) {
  await requireAdminAction();
  const related = await prisma.espacioUso.count({ where: { usoId: id } });
  if (related > 0) {
    await prisma.usoEspacio.update({ where: { id }, data: { activo: false } });
  } else {
    await prisma.usoEspacio.delete({ where: { id } });
  }
  revalidatePath("/admin/usos");
}

export async function createEquipamiento(formData: FormData) {
  await requireAdminAction();
  const nombre = text(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio.");
  await prisma.equipamiento.create({
    data: {
      nombre,
      descripcion: nullableText(formData, "descripcion"),
      categoria: nullableText(formData, "categoria"),
    },
  });
  revalidatePath("/admin/equipamientos");
  redirect("/admin/equipamientos");
}

export async function updateEquipamiento(id: string, formData: FormData) {
  await requireAdminAction();
  const nombre = text(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio.");
  await prisma.equipamiento.update({
    where: { id },
    data: {
      nombre,
      descripcion: nullableText(formData, "descripcion"),
      categoria: nullableText(formData, "categoria"),
      activo: text(formData, "activo") === "true",
    },
  });
  revalidatePath("/admin/equipamientos");
  redirect("/admin/equipamientos");
}

export async function toggleEquipamiento(id: string, activo: boolean) {
  await requireAdminAction();
  await prisma.equipamiento.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/equipamientos");
}

export async function deleteEquipamiento(id: string) {
  await requireAdminAction();
  const related = await prisma.espacioEquipamiento.count({ where: { equipamientoId: id } });
  if (related > 0) {
    await prisma.equipamiento.update({ where: { id }, data: { activo: false } });
  } else {
    await prisma.equipamiento.delete({ where: { id } });
  }
  revalidatePath("/admin/equipamientos");
}

export async function createEstado(formData: FormData) {
  await requireAdminAction();
  const nombre = text(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio.");
  await prisma.estadoFisico.create({
    data: {
      nombre,
      descripcion: nullableText(formData, "descripcion"),
      color: text(formData, "color") || "#64748B",
      orden: intValue(formData, "orden"),
    },
  });
  revalidatePath("/admin/estados");
  redirect("/admin/estados");
}

export async function updateEstado(id: string, formData: FormData) {
  await requireAdminAction();
  const nombre = text(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio.");
  await prisma.estadoFisico.update({
    where: { id },
    data: {
      nombre,
      descripcion: nullableText(formData, "descripcion"),
      color: text(formData, "color") || "#64748B",
      orden: intValue(formData, "orden"),
      activo: text(formData, "activo") === "true",
    },
  });
  revalidatePath("/admin/estados");
  redirect("/admin/estados");
}

export async function toggleEstado(id: string, activo: boolean) {
  await requireAdminAction();
  await prisma.estadoFisico.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/estados");
}

export async function deleteEstado(id: string) {
  await requireAdminAction();
  const related = await prisma.espacio.count({ where: { estadoFisicoId: id } });
  if (related > 0) {
    await prisma.estadoFisico.update({ where: { id }, data: { activo: false } });
  } else {
    await prisma.estadoFisico.delete({ where: { id } });
  }
  revalidatePath("/admin/estados");
}
