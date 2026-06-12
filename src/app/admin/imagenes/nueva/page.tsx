import Link from "next/link";
import AdminModal from "@/app/admin/_components/AdminModal";
import { prisma } from "@/lib/prisma";
import { crearImagen } from "../actions";
import ImagenForm from "../ImagenForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nueva imagen | Espacios FII" };

async function getOptions() {
  const [bloques, plantas, espacios] = await Promise.all([
    prisma.bloque.findMany({ orderBy: { orden: "asc" }, select: { id: true, nombre: true, slug: true } }),
    prisma.planta.findMany({ orderBy: [{ bloque: { orden: "asc" } }, { nivel: "asc" }], include: { bloque: { select: { nombre: true } } } }),
    prisma.espacio.findMany({ orderBy: { codigo: "asc" }, select: { id: true, codigo: true, nombre: true } }),
  ]);
  return {
    bloques: bloques.map((bloque) => ({ id: bloque.id, label: `${bloque.nombre} (${bloque.slug})` })),
    plantas: plantas.map((planta) => ({ id: planta.id, label: `${planta.bloque.nombre} - ${planta.nombre}` })),
    espacios: espacios.map((espacio) => ({ id: espacio.id, label: `${espacio.codigo} - ${espacio.nombre}` })),
  };
}

type SearchParams = {
  entidad?: string;
  entidadId?: string;
  backHref?: string;
  backLabel?: string;
};

function entidadValida(entidad?: string) {
  return entidad === "BLOQUE" || entidad === "PLANTA" || entidad === "ESPACIO" ? entidad : undefined;
}

function adminHref(href?: string) {
  return href?.startsWith("/admin/") ? href : "/admin/imagenes";
}

export default async function NuevaImagenPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const options = await getOptions();
  const presetEntidad = entidadValida(params.entidad);
  const presetEntidadId = presetEntidad ? params.entidadId : undefined;
  const backHref = adminHref(params.backHref);
  const backLabel = params.backLabel || "Imagenes";

  return (
    <AdminModal title="Nueva imagen" backHref={backHref} backLabel={backLabel} size="xl">
      <ImagenForm
        action={crearImagen}
        presetEntidad={presetEntidad}
        presetEntidadId={presetEntidadId}
        returnTo={backHref}
        {...options}
      />
      <div className="mt-4">
        <Link href={backHref} className="text-sm font-medium text-[var(--primary)] hover:underline">Volver sin guardar</Link>
      </div>
    </AdminModal>
  );
}
