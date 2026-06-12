import Link from "next/link";
import { notFound } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import { prisma } from "@/lib/prisma";
import { actualizarBloqueImagen, actualizarEspacioImagen, actualizarPlantaImagen } from "../../actions";
import { imagenBase64Src } from "@/lib/espacios";

export const dynamic = "force-dynamic";

export default async function EditarImagenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bloqueImagen = await prisma.bloqueImagen.findUnique({ where: { id } });
  const plantaImagen = bloqueImagen ? null : await prisma.plantaImagen.findUnique({ where: { id } });
  const espacioImagen = bloqueImagen || plantaImagen ? null : await prisma.espacioImagen.findUnique({ where: { id } });
  const imagen = bloqueImagen ?? plantaImagen ?? espacioImagen;
  if (!imagen) notFound();
  const action = bloqueImagen
    ? actualizarBloqueImagen.bind(null, imagen.id)
    : plantaImagen
      ? actualizarPlantaImagen.bind(null, imagen.id)
      : actualizarEspacioImagen.bind(null, imagen.id);

  return (
    <AdminModal title={`Editar imagen: ${imagen.nombre ?? imagen.tipo}`} backHref="/admin/imagenes" backLabel="Imagenes" size="xl">
      <div className="mb-5 overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--secondary)]">
        <div className="aspect-[16/9]">
          <img src={imagenBase64Src(imagen) ?? ""} alt={imagen.nombre ?? "Imagen"} className="h-full w-full object-contain p-3" />
        </div>
      </div>
      <form action={action} className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Tipo</span>
            <select name="tipo" defaultValue={imagen.tipo} className="fi fi-select">
              <option value="PLANO">Plano</option>
              <option value="REFERENCIAL">Referencial</option>
              <option value="FOTO">Foto</option>
              <option value="CROQUIS">Croquis</option>
              <option value="OTRO">Otro</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Orden</span>
            <input name="orden" type="number" defaultValue={imagen.orden} className="fi" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Reemplazar archivo</span>
            <input name="imagen" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="fi-file" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Nombre</span>
            <input name="nombre" defaultValue={imagen.nombre ?? ""} className="fi" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
            <textarea name="descripcion" rows={3} defaultValue={imagen.descripcion ?? ""} className="fi-area" />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
            <input name="principal" type="checkbox" defaultChecked={imagen.principal} />
            Principal
          </label>
          <div className="sm:col-span-2 flex justify-end gap-3">
            <Link href="/admin/imagenes" className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium">Cancelar</Link>
            <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Guardar cambios</button>
          </div>
      </form>
    </AdminModal>
  );
}
