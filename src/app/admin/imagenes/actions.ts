"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/admin";
import type { TipoImagen } from "@/generated/prisma/client";

const MIME_PERMITIDOS = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
const MAX_BYTES = 2 * 1024 * 1024;
type Entidad = "BLOQUE" | "PLANTA" | "ESPACIO";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const value = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(value) ? value : fallback;
}

function assertTipo(tipo: string): asserts tipo is TipoImagen {
  if (!["PLANO", "REFERENCIAL", "FOTO", "CROQUIS", "OTRO"].includes(tipo)) {
    throw new Error("Tipo de imagen no valido.");
  }
}

async function fileToBase64(file: File) {
  if (!file || file.size === 0) throw new Error("Debes seleccionar una imagen.");
  if (file.size > MAX_BYTES) throw new Error("La imagen supera el maximo permitido de 2 MB.");
  if (!MIME_PERMITIDOS.has(file.type)) throw new Error("Formato no permitido. Usa PNG, JPG, WEBP o SVG.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  if (Buffer.from(base64, "base64").length !== buffer.length) {
    throw new Error("La imagen no pudo validarse como Base64.");
  }
  return { base64, mimeType: file.type };
}

function revalidateImagenes() {
  revalidatePath("/");
  revalidatePath("/bloques");
  revalidatePath("/espacios");
  revalidatePath("/admin/imagenes");
}

function redirectDestino(formData: FormData, entidad: Entidad, entidadId: string) {
  const returnTo = text(formData, "returnTo");
  if (returnTo.startsWith("/admin/")) return returnTo;
  return `/admin/imagenes?entidad=${entidad}&entidadId=${entidadId}`;
}

async function commonImageData(formData: FormData, fileRequired: boolean) {
  const tipo = text(formData, "tipo");
  assertTipo(tipo);
  const file = formData.get("imagen");
  const fileData = file instanceof File && file.size > 0 ? await fileToBase64(file) : null;
  if (fileRequired && !fileData) throw new Error("Debes seleccionar una imagen.");
  return {
    tipo,
    nombre: text(formData, "nombre") || (file instanceof File ? file.name : "") || null,
    descripcion: text(formData, "descripcion") || null,
    principal: formData.get("principal") === "on",
    orden: intValue(formData, "orden"),
    ...(fileData ? { mimeType: fileData.mimeType, base64: fileData.base64 } : {}),
  };
}

async function crearImagenRelacionada(entidad: Entidad, entidadId: string, formData: FormData) {
  await requireAdminAction();
  if (!entidadId) throw new Error("Entidad relacionada no valida.");
  const data = await commonImageData(formData, true);
  if (!data.mimeType || !data.base64) throw new Error("Debes seleccionar una imagen valida.");
  const createData = data as typeof data & { mimeType: string; base64: string };

  if (entidad === "BLOQUE") {
    const bloque = await prisma.bloque.findUnique({ where: { id: entidadId }, select: { id: true } });
    if (!bloque) throw new Error("El bloque seleccionado no existe.");
    const count = await prisma.bloqueImagen.count({ where: { bloqueId: entidadId, activo: true } });
    const principal = data.principal || count === 0;
    if (principal) await prisma.bloqueImagen.updateMany({ where: { bloqueId: entidadId }, data: { principal: false } });
    await prisma.bloqueImagen.create({ data: { ...createData, principal, bloqueId: entidadId } });
  }

  if (entidad === "PLANTA") {
    const planta = await prisma.planta.findUnique({ where: { id: entidadId }, select: { id: true } });
    if (!planta) throw new Error("La planta seleccionada no existe.");
    const count = await prisma.plantaImagen.count({ where: { plantaId: entidadId, activo: true } });
    const principal = data.principal || count === 0;
    if (principal) await prisma.plantaImagen.updateMany({ where: { plantaId: entidadId }, data: { principal: false } });
    await prisma.plantaImagen.create({ data: { ...createData, principal, plantaId: entidadId } });
  }

  if (entidad === "ESPACIO") {
    const espacio = await prisma.espacio.findUnique({ where: { id: entidadId }, select: { id: true } });
    if (!espacio) throw new Error("El espacio seleccionado no existe.");
    const count = await prisma.espacioImagen.count({ where: { espacioId: entidadId, activo: true } });
    const principal = data.principal || count === 0;
    if (principal) await prisma.espacioImagen.updateMany({ where: { espacioId: entidadId }, data: { principal: false } });
    await prisma.espacioImagen.create({ data: { ...createData, principal, espacioId: entidadId } });
  }

  revalidateImagenes();
  redirect(redirectDestino(formData, entidad, entidadId));
}

export async function crearBloqueImagen(bloqueId: string, formData: FormData) {
  await crearImagenRelacionada("BLOQUE", bloqueId, formData);
}

export async function crearPlantaImagen(plantaId: string, formData: FormData) {
  await crearImagenRelacionada("PLANTA", plantaId, formData);
}

export async function crearEspacioImagen(espacioId: string, formData: FormData) {
  await crearImagenRelacionada("ESPACIO", espacioId, formData);
}

export async function crearImagen(formData: FormData) {
  const entidad = text(formData, "entidad") as Entidad;
  const entidadId = text(formData, "entidadId");
  if (!["BLOQUE", "PLANTA", "ESPACIO"].includes(entidad)) throw new Error("Entidad de imagen no valida.");
  await crearImagenRelacionada(entidad, entidadId, formData);
}

async function actualizar(entidad: Entidad, id: string, formData: FormData) {
  await requireAdminAction();
  const data = await commonImageData(formData, false);

  if (entidad === "BLOQUE") {
    const actual = await prisma.bloqueImagen.findUnique({ where: { id } });
    if (!actual) throw new Error("Imagen no encontrada.");
    if (data.principal) await prisma.bloqueImagen.updateMany({ where: { bloqueId: actual.bloqueId }, data: { principal: false } });
    await prisma.bloqueImagen.update({ where: { id }, data });
  }

  if (entidad === "PLANTA") {
    const actual = await prisma.plantaImagen.findUnique({ where: { id } });
    if (!actual) throw new Error("Imagen no encontrada.");
    if (data.principal) await prisma.plantaImagen.updateMany({ where: { plantaId: actual.plantaId }, data: { principal: false } });
    await prisma.plantaImagen.update({ where: { id }, data });
  }

  if (entidad === "ESPACIO") {
    const actual = await prisma.espacioImagen.findUnique({ where: { id } });
    if (!actual) throw new Error("Imagen no encontrada.");
    if (data.principal) await prisma.espacioImagen.updateMany({ where: { espacioId: actual.espacioId }, data: { principal: false } });
    await prisma.espacioImagen.update({ where: { id }, data });
  }

  revalidateImagenes();
}

export async function actualizarBloqueImagen(id: string, formData: FormData) {
  await actualizar("BLOQUE", id, formData);
}

export async function actualizarPlantaImagen(id: string, formData: FormData) {
  await actualizar("PLANTA", id, formData);
}

export async function actualizarEspacioImagen(id: string, formData: FormData) {
  await actualizar("ESPACIO", id, formData);
}

export async function eliminarBloqueImagen(id: string) {
  await requireAdminAction();
  await prisma.bloqueImagen.update({ where: { id }, data: { activo: false, principal: false } });
  revalidateImagenes();
}

export async function eliminarPlantaImagen(id: string) {
  await requireAdminAction();
  await prisma.plantaImagen.update({ where: { id }, data: { activo: false, principal: false } });
  revalidateImagenes();
}

export async function eliminarEspacioImagen(id: string) {
  await requireAdminAction();
  await prisma.espacioImagen.update({ where: { id }, data: { activo: false, principal: false } });
  revalidateImagenes();
}

export async function marcarBloqueImagenPrincipal(id: string) {
  await requireAdminAction();
  const imagen = await prisma.bloqueImagen.findUnique({ where: { id } });
  if (!imagen) throw new Error("Imagen no encontrada.");
  await prisma.bloqueImagen.updateMany({ where: { bloqueId: imagen.bloqueId }, data: { principal: false } });
  await prisma.bloqueImagen.update({ where: { id }, data: { principal: true, activo: true } });
  revalidateImagenes();
}

export async function marcarPlantaImagenPrincipal(id: string) {
  await requireAdminAction();
  const imagen = await prisma.plantaImagen.findUnique({ where: { id } });
  if (!imagen) throw new Error("Imagen no encontrada.");
  await prisma.plantaImagen.updateMany({ where: { plantaId: imagen.plantaId }, data: { principal: false } });
  await prisma.plantaImagen.update({ where: { id }, data: { principal: true, activo: true } });
  revalidateImagenes();
}

export async function marcarEspacioImagenPrincipal(id: string) {
  await requireAdminAction();
  const imagen = await prisma.espacioImagen.findUnique({ where: { id } });
  if (!imagen) throw new Error("Imagen no encontrada.");
  await prisma.espacioImagen.updateMany({ where: { espacioId: imagen.espacioId }, data: { principal: false } });
  await prisma.espacioImagen.update({ where: { id }, data: { principal: true, activo: true } });
  revalidateImagenes();
}
