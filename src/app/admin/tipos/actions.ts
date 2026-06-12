"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/admin";

function makeSlug(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}

export async function createTipo(formData: FormData) {
  await requireAdminAction();
  const id         = makeSlug(String(formData.get("id") ?? "").trim());
  const etiqueta   = String(formData.get("etiqueta") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const color      = String(formData.get("color") ?? "").trim();
  const accent     = String(formData.get("accent") ?? "#64748B").trim();
  const icono      = String(formData.get("icono") ?? "").trim() || null;
  const orden      = parseInt(String(formData.get("orden") ?? "0"), 10);

  if (!id || !etiqueta || !color) throw new Error("ID, etiqueta y color son obligatorios.");

  await prisma.tipo.create({ data: { id, etiqueta, descripcion, color, accent, icono, orden } });
  revalidatePath("/admin/tipos");
  revalidatePath("/espacios");
  redirect("/admin/tipos");
}

export async function updateTipo(id: string, formData: FormData) {
  await requireAdminAction();
  const etiqueta   = String(formData.get("etiqueta") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const color      = String(formData.get("color") ?? "").trim();
  const accent     = String(formData.get("accent") ?? "#64748B").trim();
  const icono      = String(formData.get("icono") ?? "").trim() || null;
  const activo     = formData.get("activo") === "true";
  const orden      = parseInt(String(formData.get("orden") ?? "0"), 10);

  if (!etiqueta || !color) throw new Error("Etiqueta y color son obligatorios.");

  await prisma.tipo.update({ where: { id }, data: { etiqueta, descripcion, color, accent, icono, activo, orden } });
  revalidatePath("/admin/tipos");
  revalidatePath("/espacios");
  redirect("/admin/tipos");
}

export async function toggleTipo(id: string, activo: boolean) {
  await requireAdminAction();
  await prisma.tipo.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/tipos");
}

export async function deleteTipo(id: string) {
  await requireAdminAction();
  const espacios = await prisma.espacio.count({ where: { tipoId: id } });
  if (espacios > 0) {
    await prisma.tipo.update({ where: { id }, data: { activo: false } });
  } else {
    await prisma.tipo.delete({ where: { id } });
  }
  revalidatePath("/admin/tipos");
  revalidatePath("/espacios");
}
