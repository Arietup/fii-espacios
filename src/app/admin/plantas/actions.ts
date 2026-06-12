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

function clampedInt(formData: FormData, key: string, min = 0, max = 9999) {
  return Math.max(min, Math.min(max, intValue(formData, key)));
}

function validateLen(value: string, field: string, maxLen: number) {
  if (value && value.length > maxLen) throw new Error(`El campo "${field}" no puede superar ${maxLen} caracteres.`);
  return value;
}

function validatePlantaFields(formData: FormData) {
  const bloqueId    = text(formData, "bloqueId");
  const nombre      = validateLen(text(formData, "nombre"),      "Nombre",        200);
  const imagenUrl   = validateLen(text(formData, "imagenUrl"),   "Imagen/Plano",  500);
  const codigo      = validateLen(text(formData, "codigo"),      "Código",         50);
  const descripcion = validateLen(text(formData, "descripcion"), "Descripción",  1000);
  const observaciones = validateLen(text(formData, "observaciones"), "Observaciones", 1000);

  if (!bloqueId)  throw new Error("El bloque es obligatorio.");
  if (!nombre)    throw new Error("El nombre es obligatorio.");
  if (!imagenUrl) throw new Error("La imagen/plano es obligatoria.");

  return {
    bloqueId,
    nombre,
    imagenUrl,
    codigo:       codigo || null,
    descripcion:  descripcion || null,
    observaciones: observaciones || null,
    nivel:  clampedInt(formData, "nivel"),
    orden:  clampedInt(formData, "orden"),
  };
}

export async function createPlanta(formData: FormData) {
  await requireAdminAction();
  const fields = validatePlantaFields(formData);
  await prisma.planta.create({ data: fields });
  revalidatePath("/admin/plantas");
  revalidatePath("/bloques");
  redirect("/admin/plantas");
}

export async function updatePlanta(id: string, formData: FormData) {
  await requireAdminAction();
  if (!id) throw new Error("ID de planta inválido.");
  const fields = validatePlantaFields(formData);
  const activo = text(formData, "activo") === "true";

  await prisma.$transaction(async (tx) => {
    await tx.planta.update({ where: { id }, data: { ...fields, activo } });
    await tx.espacio.updateMany({ where: { plantaId: id }, data: { bloqueId: fields.bloqueId } });
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

// ─── Acciones inline (sin redirect, para modales cliente) ────────────────────

export async function createPlantaInline(formData: FormData) {
  await requireAdminAction();
  const fields = validatePlantaFields(formData);
  await prisma.planta.create({ data: fields });
  revalidatePath("/admin/plantas");
  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
}

export async function updatePlantaInline(id: string, formData: FormData) {
  await requireAdminAction();
  if (!id) throw new Error("ID de planta inválido.");
  const fields = validatePlantaFields(formData);
  const activo = text(formData, "activo") === "true";

  await prisma.$transaction(async (tx) => {
    await tx.planta.update({ where: { id }, data: { ...fields, activo } });
    await tx.espacio.updateMany({ where: { plantaId: id }, data: { bloqueId: fields.bloqueId } });
  });

  revalidatePath("/admin/plantas");
  revalidatePath("/admin/bloques");
  revalidatePath("/admin/espacios");
  revalidatePath("/bloques");
  revalidatePath("/espacios");
}
