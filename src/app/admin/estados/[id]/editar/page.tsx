import Link from "next/link";
import { notFound } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import { prisma } from "@/lib/prisma";
import { updateEstado } from "@/app/admin/catalogos-actions";

export const dynamic = "force-dynamic";

export default async function EditarEstadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const estado = await prisma.estadoFisico.findUnique({ where: { id } });
  if (!estado) notFound();

  return (
    <AdminModal title={`Editar: ${estado.nombre}`} backHref="/admin/estados" backLabel="Estados">
      <form action={updateEstado.bind(null, estado.id)} className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Nombre *</span>
          <input name="nombre" required defaultValue={estado.nombre} className="fi" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Color</span>
          <input name="color" defaultValue={estado.color} className="fi" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Orden</span>
          <input name="orden" type="number" defaultValue={estado.orden} className="fi" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Estado</span>
          <select name="activo" defaultValue={estado.activo.toString()} className="fi fi-select">
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
          <textarea name="descripcion" rows={3} defaultValue={estado.descripcion ?? ""} className="fi-area" />
        </label>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link href="/admin/estados" className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium">Cancelar</Link>
          <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Guardar cambios</button>
        </div>
      </form>
    </AdminModal>
  );
}
