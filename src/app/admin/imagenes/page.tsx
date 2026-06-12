import Link from "next/link";
import Icon from "@/components/Icon";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import { fetchImagenesAdmin, imagenBase64Src } from "@/lib/espacios";
import {
  eliminarBloqueImagen,
  eliminarEspacioImagen,
  eliminarPlantaImagen,
  marcarBloqueImagenPrincipal,
  marcarEspacioImagenPrincipal,
  marcarPlantaImagenPrincipal,
} from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Imagenes | Espacios FII" };

export default async function AdminImagenesPage() {
  const imagenes = await fetchImagenesAdmin();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Imagenes"
        description="Gestiona planos, fotos e imagenes referenciales guardadas como Base64 en PostgreSQL."
        actions={
          <Link href="/admin/imagenes/nueva" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Icon name="plus" className="h-4 w-4" />Nueva imagen
          </Link>
        }
      />
      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="border-b border-[var(--border-soft)] bg-[var(--secondary)] text-left">
              <tr>
                {["Vista", "Entidad", "Tipo", "Nombre", "Principal", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-[var(--text-secondary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {imagenes.map((imagen) => {
                const markAction = imagen.entidad === "BLOQUE" ? marcarBloqueImagenPrincipal : imagen.entidad === "PLANTA" ? marcarPlantaImagenPrincipal : marcarEspacioImagenPrincipal;
                const deleteAction = imagen.entidad === "BLOQUE" ? eliminarBloqueImagen : imagen.entidad === "PLANTA" ? eliminarPlantaImagen : eliminarEspacioImagen;
                return (
                <tr key={imagen.id} className="hover:bg-[var(--secondary)]">
                  <td className="px-4 py-3">
                    <img src={imagenBase64Src(imagen) ?? ""} alt={imagen.nombre ?? "Imagen"} className="h-16 w-24 rounded-lg border border-[var(--border-soft)] object-contain" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{imagen.entidad}</p>
                    <p className="font-mono text-xs text-[var(--text-muted)]">{imagen.entidadId}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{imagen.tipo}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{imagen.nombre ?? "Sin nombre"}</p>
                    <p className="text-xs text-[var(--text-muted)]">{imagen.mimeType}</p>
                  </td>
                  <td className="px-4 py-3">
                    {imagen.principal ? (
                      <span className="badge-pill bg-green-100 text-green-700">Principal</span>
                    ) : (
                      <form action={markAction.bind(null, imagen.id)}>
                        <button type="submit" className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Marcar</button>
                      </form>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/imagenes/${imagen.id}/editar`} className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Editar</Link>
                      <DeleteButton formAction={deleteAction.bind(null, imagen.id)} label={imagen.nombre ?? "imagen"} />
                    </div>
                  </td>
                </tr>
                );
              })}
              {imagenes.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">Sin imagenes registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
