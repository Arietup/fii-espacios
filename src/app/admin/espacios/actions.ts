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

function nullableInt(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : null;
}

function nullableFloat(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
}

async function resolveBloqueFromPlanta(plantaId: string, bloqueId: string) {
  const planta = await prisma.planta.findUnique({ where: { id: plantaId }, select: { bloqueId: true } });
  if (!planta) throw new Error("La planta seleccionada no existe.");
  if (bloqueId && bloqueId !== planta.bloqueId) {
    throw new Error("La planta seleccionada no pertenece al bloque indicado.");
  }
  return planta.bloqueId;
}

export async function createEspacio(formData: FormData) {
  await requireAdminAction();
  const nombre      = String(formData.get("nombre") ?? "").trim();
  const codigo      = String(formData.get("codigo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const tipoId      = String(formData.get("tipoId") ?? "").trim();
  const bloqueId    = String(formData.get("bloqueId") ?? "").trim();
  const plantaId    = String(formData.get("plantaId") ?? "").trim();
  const capacidad   = nullableInt(formData, "capacidad");
  const customSlug  = String(formData.get("slug") ?? "").trim() || slug(`${tipoId}-${codigo}`);

  if (!nombre || !codigo || !descripcion || !tipoId || !bloqueId || !plantaId) {
    throw new Error("Todos los campos obligatorios deben estar completos.");
  }

  const bloqueRealId = await resolveBloqueFromPlanta(plantaId, bloqueId);

  const espacio = await prisma.espacio.create({
    data: {
      slug: customSlug,
      codigo,
      nombre,
      descripcion,
      capacidad,
      cantidadPuestos: nullableInt(formData, "cantidadPuestos"),
      areaM2: nullableFloat(formData, "areaM2"),
      largoCm: nullableInt(formData, "largoCm"),
      anchoCm: nullableInt(formData, "anchoCm"),
      altoCm: nullableInt(formData, "altoCm"),
      accesoPublico: formData.get("accesoPublico") !== "false",
      ubicacionReferencia: String(formData.get("ubicacionReferencia") ?? "").trim() || null,
      observaciones: String(formData.get("observaciones") ?? "").trim() || null,
      estadoFisicoId: String(formData.get("estadoFisicoId") ?? "").trim() || null,
      tipoId,
      bloqueId: bloqueRealId,
      plantaId,
    },
  });
  await syncRelations(espacio.id, formData);

  revalidatePath("/admin/espacios");
  revalidatePath("/espacios");
  revalidatePath("/");
}

export async function updateEspacio(id: string, formData: FormData) {
  await requireAdminAction();
  const nombre      = String(formData.get("nombre") ?? "").trim();
  const codigo      = String(formData.get("codigo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const tipoId      = String(formData.get("tipoId") ?? "").trim();
  const bloqueId    = String(formData.get("bloqueId") ?? "").trim();
  const plantaId    = String(formData.get("plantaId") ?? "").trim();
  const capacidad   = nullableInt(formData, "capacidad");

  if (!nombre || !codigo || !descripcion || !tipoId || !bloqueId || !plantaId) {
    throw new Error("Todos los campos obligatorios deben estar completos.");
  }

  const bloqueRealId = await resolveBloqueFromPlanta(plantaId, bloqueId);

  await prisma.espacio.update({
    where: { id },
    data:  {
      nombre,
      codigo,
      descripcion,
      tipoId,
      bloqueId: bloqueRealId,
      plantaId,
      capacidad,
      cantidadPuestos: nullableInt(formData, "cantidadPuestos"),
      areaM2: nullableFloat(formData, "areaM2"),
      largoCm: nullableInt(formData, "largoCm"),
      anchoCm: nullableInt(formData, "anchoCm"),
      altoCm: nullableInt(formData, "altoCm"),
      accesoPublico: formData.get("accesoPublico") !== "false",
      ubicacionReferencia: String(formData.get("ubicacionReferencia") ?? "").trim() || null,
      observaciones: String(formData.get("observaciones") ?? "").trim() || null,
      estadoFisicoId: String(formData.get("estadoFisicoId") ?? "").trim() || null,
    },
  });
  await syncRelations(id, formData);

  revalidatePath("/admin/espacios");
  revalidatePath("/espacios");
  revalidatePath("/");
}

export async function toggleEspacio(id: string, activo: boolean) {
  await requireAdminAction();
  await prisma.espacio.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/espacios");
  revalidatePath("/espacios");
}

export async function deleteEspacio(id: string) {
  await requireAdminAction();
  await prisma.espacio.update({ where: { id }, data: { activo: false } });
  revalidatePath("/admin/espacios");
  revalidatePath("/espacios");
  revalidatePath("/");
}

async function syncRelations(espacioId: string, formData: FormData) {
  const usoIds = formData.getAll("usoIds").map(String).filter(Boolean);
  const equipamientoIds = formData.getAll("equipamientoIds").map(String).filter(Boolean);

  await prisma.$transaction([
    prisma.espacioUso.deleteMany({ where: { espacioId } }),
    ...usoIds.map((usoId) => prisma.espacioUso.create({ data: { espacioId, usoId } })),
    prisma.espacioEquipamiento.deleteMany({ where: { espacioId } }),
    ...equipamientoIds.map((equipamientoId) =>
      prisma.espacioEquipamiento.create({
        data: {
          espacioId,
          equipamientoId,
          cantidad: nullableInt(formData, `equipamientoCantidad:${equipamientoId}`) ?? 1,
          estado: String(formData.get(`equipamientoEstado:${equipamientoId}`) ?? "").trim() || null,
          observaciones: String(formData.get(`equipamientoObservaciones:${equipamientoId}`) ?? "").trim() || null,
        },
      }),
    ),
  ]);
}
