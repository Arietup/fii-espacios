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

// ─── Bloques ─────────────────────────────────────────────────────────────────

export async function createBloque(formData: FormData) {
  await requireAdminAction();
  const nombre      = String(formData.get("nombre") ?? "").trim();
  const resumen     = String(formData.get("resumen") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const orden       = parseInt(String(formData.get("orden") ?? "0"), 10);
  const customSlug  = String(formData.get("slug") ?? "").trim() || slug(nombre);

  if (!nombre || !resumen || !descripcion) {
    throw new Error("Nombre, resumen y descripcion son obligatorios.");
  }

  await prisma.bloque.create({
    data: { slug: customSlug, nombre, resumen, descripcion, orden },
  });

  revalidatePath("/admin/bloques");
  revalidatePath("/bloques");
  revalidatePath("/");
}

export async function updateBloque(id: string, formData: FormData) {
  await requireAdminAction();
  const nombre      = String(formData.get("nombre") ?? "").trim();
  const resumen     = String(formData.get("resumen") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const orden       = parseInt(String(formData.get("orden") ?? "0"), 10);

  if (!nombre || !resumen || !descripcion) {
    throw new Error("Nombre, resumen y descripcion son obligatorios.");
  }

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
