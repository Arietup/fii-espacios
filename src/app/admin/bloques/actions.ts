"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/admin";

function slug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/* Validación de campos de texto con longitud máxima */
function validateText(
  value: string,
  field: string,
  required: boolean,
  maxLen: number,
): string {
  const v = value.trim();
  if (required && !v) throw new Error(`El campo "${field}" es obligatorio.`);
  if (v.length > maxLen) throw new Error(`El campo "${field}" no puede superar ${maxLen} caracteres.`);
  return v;
}

// ─── Bloques ─────────────────────────────────────────────────────────────────

export async function createBloque(formData: FormData) {
  await requireAdminAction();
  const nombre      = validateText(String(formData.get("nombre") ?? ""),      "Nombre",      true,  200);
  const resumen     = validateText(String(formData.get("resumen") ?? ""),     "Resumen",     true,  500);
  const descripcion = validateText(String(formData.get("descripcion") ?? ""), "Descripción", true, 2000);
  const customSlug  = validateText(String(formData.get("slug") ?? "") || slug(nombre), "Slug", false, 100);
  const orden       = Math.max(0, Math.min(9999, parseInt(String(formData.get("orden") ?? "0"), 10) || 0));

  await prisma.bloque.create({
    data: { slug: customSlug, nombre, resumen, descripcion, orden },
  });

  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
  revalidatePath("/");
}

export async function updateBloque(id: string, formData: FormData) {
  await requireAdminAction();
  if (!id || typeof id !== "string") throw new Error("ID de bloque inválido.");

  const nombre      = validateText(String(formData.get("nombre") ?? ""),      "Nombre",      true,  200);
  const resumen     = validateText(String(formData.get("resumen") ?? ""),     "Resumen",     true,  500);
  const descripcion = validateText(String(formData.get("descripcion") ?? ""), "Descripción", true, 2000);
  const orden       = Math.max(0, Math.min(9999, parseInt(String(formData.get("orden") ?? "0"), 10) || 0));

  await prisma.bloque.update({
    where: { id },
    data:  { nombre, resumen, descripcion, orden },
  });

  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
  revalidatePath("/");
}

export async function toggleBloque(id: string, activo: boolean) {
  await requireAdminAction();
  await prisma.bloque.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
  revalidatePath("/");
}

export async function deleteBloque(id: string) {
  await requireAdminAction();
  const relaciones = await prisma.bloque.findUnique({
    where: { id },
    select: { _count: { select: { plantas: true, espacios: true } } },
  });
  if (!relaciones) return;
  if (relaciones._count.plantas > 0 || relaciones._count.espacios > 0) {
    await prisma.bloque.update({ where: { id }, data: { activo: false } });
  } else {
    await prisma.bloque.delete({ where: { id } });
  }
  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
  revalidatePath("/");
}

// ─── Plantas ─────────────────────────────────────────────────────────────────

export async function createPlanta(bloqueId: string, formData: FormData) {
  await requireAdminAction();
  const nombre    = String(formData.get("nombre") ?? "").trim();
  const nivel     = parseInt(String(formData.get("nivel") ?? "0"), 10);
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();

  if (!nombre || !imagenUrl) throw new Error("Nombre e imagen son obligatorios.");

  await prisma.planta.create({ data: { nombre, nivel, imagenUrl, bloqueId } });
  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
}

export async function updatePlanta(id: string, formData: FormData) {
  await requireAdminAction();
  const nombre    = String(formData.get("nombre") ?? "").trim();
  const nivel     = parseInt(String(formData.get("nivel") ?? "0"), 10);
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();

  if (!nombre || !imagenUrl) throw new Error("Nombre e imagen son obligatorios.");

  await prisma.planta.update({ where: { id }, data: { nombre, nivel, imagenUrl } });
  revalidatePath("/admin/bloques");
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
  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
}
