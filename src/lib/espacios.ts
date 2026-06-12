import { prisma } from "@/lib/prisma";
import type { Bloque, Espacio, PlantaBloque } from "@/data/tipos";
import type { TipoEspacio } from "@/data/tipos";

export function imagenBase64Src(imagen: { mimeType: string; base64: string } | null | undefined) {
  if (!imagen) return null;
  return `data:${imagen.mimeType};base64,${imagen.base64}`;
}

type EspacioConRelaciones = {
  slug: string; codigo: string; nombre: string; descripcion: string;
  capacidad: number | null; tipoId: string;
  bloque: { slug: string }; planta: { nombre: string };
};

type BloqueConRelaciones = {
  slug: string; nombre: string; resumen: string; descripcion: string;
  plantas: { id: string; nombre: string; nivel: number; imagenUrl: string }[];
};

function mapEspacio(e: EspacioConRelaciones): Espacio {
  return { id: e.slug, codigo: e.codigo, nombre: e.nombre, tipo: e.tipoId as TipoEspacio, bloqueId: e.bloque.slug, planta: e.planta.nombre, descripcion: e.descripcion, capacidad: e.capacidad ?? undefined };
}

function mapBloque(
  b: BloqueConRelaciones,
  imagenesPorPlanta: Map<string, { mimeType: string; base64: string }> = new Map(),
): Bloque {
  const plantasOrdenadas = [...b.plantas].sort((a, z) => a.nivel - z.nivel);
  const plantas: PlantaBloque[] = plantasOrdenadas.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    imagen: imagenBase64Src(imagenesPorPlanta.get(p.id)) ?? p.imagenUrl,
  }));
  return { id: b.slug, nombre: b.nombre, resumen: b.resumen, descripcion: b.descripcion, plantas, imagen: plantas[0]?.imagen ?? "" };
}

async function fetchPlantaImagenesPrincipales(plantaIds: string[], tipo = "PLANO") {
  if (plantaIds.length === 0) return new Map<string, { mimeType: string; base64: string }>();
  const imagenes = await prisma.plantaImagen.findMany({
    where: { plantaId: { in: plantaIds }, tipo: tipo as never, activo: true },
    orderBy: [{ principal: "desc" }, { orden: "asc" }, { createdAt: "asc" }],
  });
  const map = new Map<string, { mimeType: string; base64: string }>();
  for (const imagen of imagenes) {
    if (!map.has(imagen.plantaId)) map.set(imagen.plantaId, imagen);
  }
  return map;
}

export async function fetchBloques(): Promise<Bloque[]> {
  const bloques = await prisma.bloque.findMany({ where: { activo: true }, orderBy: { orden: "asc" }, include: { plantas: { where: { activo: true }, orderBy: { nivel: "asc" } } } });
  const plantaIds = bloques.flatMap((bloque) => bloque.plantas.map((planta) => planta.id));
  const imagenesPorPlanta = await fetchPlantaImagenesPrincipales(plantaIds);
  return bloques.map((bloque) => mapBloque(bloque, imagenesPorPlanta));
}

export async function fetchBloque(slug: string): Promise<Bloque | null> {
  const bloque = await prisma.bloque.findUnique({ where: { slug }, include: { plantas: { where: { activo: true }, orderBy: { nivel: "asc" } } } });
  if (!bloque || !bloque.activo) return null;
  const imagenesPorPlanta = await fetchPlantaImagenesPrincipales(bloque.plantas.map((planta) => planta.id));
  return mapBloque(bloque, imagenesPorPlanta);
}

export async function fetchBloqueDetalleImagenes(slug: string) {
  return prisma.bloque.findUnique({
    where: { slug },
    include: {
      imagenes: {
        where: { activo: true },
        orderBy: [{ principal: "desc" }, { orden: "asc" }, { createdAt: "asc" }],
      },
      plantas: {
        where: { activo: true },
        orderBy: { nivel: "asc" },
        include: {
          imagenes: {
            where: { activo: true },
            orderBy: [{ principal: "desc" }, { orden: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });
}

export async function fetchEspacios(): Promise<Espacio[]> {
  const espacios = await prisma.espacio.findMany({ where: { activo: true }, orderBy: { codigo: "asc" }, include: { bloque: true, planta: true } });
  return espacios.map(mapEspacio);
}

export async function fetchEspaciosDeBloque(bloqueSlug: string): Promise<Espacio[]> {
  const espacios = await prisma.espacio.findMany({ where: { activo: true, bloque: { slug: bloqueSlug } }, orderBy: { codigo: "asc" }, include: { bloque: true, planta: true } });
  return espacios.map(mapEspacio);
}

export async function fetchEspacio(slug: string): Promise<Espacio | null> {
  const espacio = await prisma.espacio.findUnique({ where: { slug }, include: { bloque: true, planta: true } });
  if (!espacio || !espacio.activo) return null;
  return mapEspacio(espacio);
}

export async function fetchEspacioDetalle(slug: string) {
  return prisma.espacio.findUnique({
    where: { slug },
    include: {
      tipo: true,
      bloque: true,
      planta: {
        include: {
          imagenes: {
            where: { activo: true },
            orderBy: [{ principal: "desc" }, { orden: "asc" }, { createdAt: "asc" }],
          },
        },
      },
      estadoFisico: true,
      usos: { include: { uso: true } },
      equipamiento: { include: { equipamiento: true } },
      comentarios: { where: { visiblePublicamente: true }, orderBy: { createdAt: "desc" } },
      imagenes: {
        where: { activo: true },
        orderBy: [{ principal: "desc" }, { orden: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function fetchBloquesAdmin() {
  return prisma.bloque.findMany({ orderBy: { orden: "asc" }, include: { plantas: { orderBy: { nivel: "asc" } }, _count: { select: { espacios: true } } } });
}

export async function fetchEspaciosAdmin() {
  return prisma.espacio.findMany({
    orderBy: [{ bloque: { orden: "asc" } }, { codigo: "asc" }],
    include: { bloque: true, planta: true, tipo: true, estadoFisico: true, _count: { select: { usos: true, equipamiento: true } } },
  });
}

export async function fetchEspacioAdmin(id: string) {
  return prisma.espacio.findUnique({
    where: { id },
    include: {
      tipo: true, bloque: true, planta: true, estadoFisico: true,
      usos: { include: { uso: true } },
      equipamiento: { include: { equipamiento: true } },
      comentarios: { include: { usuario: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      imagenes: { orderBy: [{ principal: "desc" }, { orden: "asc" }, { createdAt: "asc" }] },
    },
  });
}

export async function fetchImagenesEntidad(entidad: string, entidadId: string) {
  const orderBy = [{ principal: "desc" as const }, { orden: "asc" as const }, { createdAt: "asc" as const }];
  if (entidad === "BLOQUE") return prisma.bloqueImagen.findMany({ where: { bloqueId: entidadId, activo: true }, orderBy });
  if (entidad === "PLANTA") return prisma.plantaImagen.findMany({ where: { plantaId: entidadId, activo: true }, orderBy });
  if (entidad === "ESPACIO") return prisma.espacioImagen.findMany({ where: { espacioId: entidadId, activo: true }, orderBy });
  return [];
}

export async function fetchImagenPrincipal(entidad: string, entidadId: string, tipo?: "PLANO" | "REFERENCIAL" | "FOTO" | "CROQUIS" | "OTRO") {
  const orderBy = [{ principal: "desc" as const }, { orden: "asc" as const }, { createdAt: "asc" as const }];
  if (entidad === "BLOQUE") return prisma.bloqueImagen.findFirst({ where: { bloqueId: entidadId, activo: true, ...(tipo ? { tipo } : {}) }, orderBy });
  if (entidad === "PLANTA") return prisma.plantaImagen.findFirst({ where: { plantaId: entidadId, activo: true, ...(tipo ? { tipo } : {}) }, orderBy });
  if (entidad === "ESPACIO") return prisma.espacioImagen.findFirst({ where: { espacioId: entidadId, activo: true, ...(tipo ? { tipo } : {}) }, orderBy });
  return null;
}

export async function fetchImagenesAdmin() {
  const [bloques, plantas, espacios] = await Promise.all([
    prisma.bloqueImagen.findMany({ orderBy: [{ createdAt: "desc" }], take: 80 }),
    prisma.plantaImagen.findMany({ orderBy: [{ createdAt: "desc" }], take: 80 }),
    prisma.espacioImagen.findMany({ orderBy: [{ createdAt: "desc" }], take: 80 }),
  ]);
  return [
    ...bloques.map((imagen) => ({ ...imagen, entidad: "BLOQUE" as const, entidadId: imagen.bloqueId })),
    ...plantas.map((imagen) => ({ ...imagen, entidad: "PLANTA" as const, entidadId: imagen.plantaId })),
    ...espacios.map((imagen) => ({ ...imagen, entidad: "ESPACIO" as const, entidadId: imagen.espacioId })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 200);
}

export async function fetchTipos() {
  return prisma.tipo.findMany({ orderBy: { orden: "asc" } });
}

export async function fetchTiposActivos() {
  return prisma.tipo.findMany({ where: { activo: true }, orderBy: { orden: "asc" } });
}

export async function fetchBloqueConPlantas() {
  return prisma.bloque.findMany({ orderBy: { orden: "asc" }, include: { plantas: { orderBy: { nivel: "asc" } } } });
}

export async function fetchBloqueConPlantasActivas() {
  return prisma.bloque.findMany({ where: { activo: true }, orderBy: { orden: "asc" }, include: { plantas: { where: { activo: true }, orderBy: { nivel: "asc" } } } });
}

export async function fetchEstadosFisicos() {
  return prisma.estadoFisico.findMany({ where: { activo: true }, orderBy: { orden: "asc" } });
}

export async function fetchEstadosFisicosAdmin() {
  return prisma.estadoFisico.findMany({ orderBy: { orden: "asc" } });
}

export async function fetchUsos() {
  return prisma.usoEspacio.findMany({ where: { activo: true }, orderBy: { orden: "asc" } });
}

export async function fetchUsosAdmin() {
  return prisma.usoEspacio.findMany({ orderBy: { orden: "asc" } });
}

export async function fetchEquipamientos() {
  return prisma.equipamiento.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } });
}

export async function fetchEquipamientosAdmin() {
  return prisma.equipamiento.findMany({ orderBy: [{ categoria: "asc" }, { nombre: "asc" }] });
}

export async function fetchPlantasAdmin() {
  return prisma.planta.findMany({ orderBy: [{ bloque: { orden: "asc" } }, { nivel: "asc" }], include: { bloque: { select: { id: true, nombre: true, slug: true } }, _count: { select: { espacios: true } } } });
}

export async function fetchPlanta(id: string) {
  return prisma.planta.findUnique({ where: { id }, include: { bloque: true } });
}

export async function fetchAdminKpis() {
  const [bloques, plantas, espacios, tipos, equipamientos, usos, estados, bloquesActivos, espaciosActivos] = await Promise.all([
    prisma.bloque.count(), prisma.planta.count(), prisma.espacio.count(), prisma.tipo.count(),
    prisma.equipamiento.count(), prisma.usoEspacio.count(), prisma.estadoFisico.count(),
    prisma.bloque.count({ where: { activo: true } }), prisma.espacio.count({ where: { activo: true } }),
  ]);
  return { bloques, plantas, espacios, tipos, equipamientos, usos, estados, bloquesActivos, espaciosActivos };
}
