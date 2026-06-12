import Link from "next/link";
import { notFound } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import { prisma } from "@/lib/prisma";
import { updateEquipamiento } from "@/app/admin/catalogos-actions";

export const dynamic = "force-dynamic";

export default async function EditarEquipamientoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.equipamiento.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <AdminModal title={`Editar: ${item.nombre}`} backHref="/admin/equipamientos" backLabel="Equipamientos">
      <form action={updateEquipamiento.bind(null, item.id)} className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Nombre *</span>
          <input name="nombre" required defaultValue={item.nombre} className="fi" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Categoria</span>
          <input name="categoria" defaultValue={item.categoria ?? ""} className="fi" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Estado</span>
          <select name="activo" defaultValue={item.activo.toString()} className="fi fi-select">
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
          <textarea name="descripcion" rows={3} defaultValue={item.descripcion ?? ""} className="fi-area" />
        </label>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link href="/admin/equipamientos" className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium">Cancelar</Link>
          <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Guardar cambios</button>
        </div>
      </form>
    </AdminModal>
  );
}
