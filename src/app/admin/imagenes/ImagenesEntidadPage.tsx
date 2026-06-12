import Link from "next/link";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import { prisma } from "@/lib/prisma";
import { fetchImagenesEntidad, imagenBase64Src } from "@/lib/espacios";
import {
  eliminarBloqueImagen,
  eliminarEspacioImagen,
  eliminarPlantaImagen,
  marcarBloqueImagenPrincipal,
  marcarEspacioImagenPrincipal,
  marcarPlantaImagenPrincipal,
} from "./actions";
import Icon from "@/components/Icon";

type Entidad = "BLOQUE" | "PLANTA" | "ESPACIO";

export default async function ImagenesEntidadPage({
  entidad,
  entidadId,
  title,
  backHref,
  backLabel,
}: {
  entidad: Entidad;
  entidadId: string;
  title: string;
  backHref: string;
  backLabel: string;
}) {
  const imagenes = await fetchImagenesEntidad(entidad, entidadId);
  const markAction = entidad === "BLOQUE" ? marcarBloqueImagenPrincipal : entidad === "PLANTA" ? marcarPlantaImagenPrincipal : marcarEspacioImagenPrincipal;
  const deleteAction = entidad === "BLOQUE" ? eliminarBloqueImagen : entidad === "PLANTA" ? eliminarPlantaImagen : eliminarEspacioImagen;
  const entidadImagenHref =
    entidad === "BLOQUE"
      ? `/admin/bloques/${entidadId}/imagenes`
      : entidad === "PLANTA"
        ? `/admin/plantas/${entidadId}/imagenes`
        : `/admin/espacios/${entidadId}/imagenes`;
  const nuevaImagenHref = `/admin/imagenes/nueva?entidad=${entidad}&entidadId=${entidadId}&backHref=${encodeURIComponent(entidadImagenHref)}&backLabel=${encodeURIComponent("Imagenes")}`;

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title={`Imagenes: ${title}`}
        description="Carga planos, fotos o referencias visuales en Base64 para este registro."
        backHref={backHref}
        backLabel={backLabel}
      />
      <div className="flex justify-end">
        <Link href={nuevaImagenHref} className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
          <Icon name="plus" className="h-4 w-4" />
          Subir imagen
        </Link>
      </div>
      <section className="surface-card overflow-hidden">
        <div className="border-b border-[var(--border-soft)] px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--text)]">Imagenes registradas</h2>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {imagenes.map((imagen) => (
            <article key={imagen.id} className="overflow-hidden rounded-lg border border-[var(--border-soft)] bg-white">
              <div className="aspect-[16/9] bg-[var(--secondary)]">
                <img src={imagenBase64Src(imagen) ?? ""} alt={imagen.nombre ?? "Imagen"} className="h-full w-full object-contain p-3" />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">{imagen.nombre ?? imagen.tipo}</p>
                  <p className="text-xs text-[var(--text-muted)]">{imagen.tipo} · {imagen.mimeType}</p>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{imagen.descripcion ?? "Sin descripcion"}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {imagen.principal ? (
                    <span className="badge-pill bg-green-100 text-green-700">Principal</span>
                  ) : (
                    <form action={markAction.bind(null, imagen.id)}>
                      <button type="submit" className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Marcar principal</button>
                    </form>
                  )}
                  <Link href={`/admin/imagenes/${imagen.id}/editar`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Editar</Link>
                  <DeleteButton formAction={deleteAction.bind(null, imagen.id)} label={imagen.nombre ?? "imagen"} />
                </div>
              </div>
            </article>
          ))}
          {imagenes.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">Aun no hay imagenes para este registro.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export async function getBloqueImagenPageData(id: string) {
  const bloque = await prisma.bloque.findUnique({ where: { id } });
  return bloque ? { title: bloque.nombre, backHref: "/admin/bloques", backLabel: "Bloques" } : null;
}

export async function getPlantaImagenPageData(id: string) {
  const planta = await prisma.planta.findUnique({ where: { id }, include: { bloque: true } });
  return planta ? { title: `${planta.bloque.nombre} - ${planta.nombre}`, backHref: "/admin/plantas", backLabel: "Plantas" } : null;
}

export async function getEspacioImagenPageData(id: string) {
  const espacio = await prisma.espacio.findUnique({ where: { id } });
  return espacio ? { title: `${espacio.codigo} - ${espacio.nombre}`, backHref: `/admin/espacios/${espacio.id}`, backLabel: "Espacio" } : null;
}
