import Link from "next/link";
import { notFound } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import { fetchBloqueConPlantas, fetchPlanta } from "@/lib/espacios";
import { updatePlanta } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditarPlantaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [planta, bloques] = await Promise.all([fetchPlanta(id), fetchBloqueConPlantas()]);
  if (!planta) notFound();

  return (
    <AdminModal title={`Editar: ${planta.nombre}`} backHref="/admin/plantas" backLabel="Plantas" size="xl">
      <form action={updatePlanta.bind(null, planta.id)} className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Bloque *</span>
            <select name="bloqueId" required defaultValue={planta.bloqueId} className="fi fi-select">
              {bloques.map((bloque) => <option key={bloque.id} value={bloque.id}>{bloque.nombre}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Nombre *</span>
            <input name="nombre" required defaultValue={planta.nombre} className="fi" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Codigo</span>
            <input name="codigo" defaultValue={planta.codigo ?? ""} className="fi" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Nivel</span>
            <input name="nivel" type="number" defaultValue={planta.nivel} className="fi" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Orden</span>
            <input name="orden" type="number" defaultValue={planta.orden} className="fi" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Estado</span>
            <select name="activo" defaultValue={planta.activo.toString()} className="fi fi-select">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Imagen / plano URL *</span>
            <input name="imagenUrl" required defaultValue={planta.imagenUrl} className="fi" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
            <textarea name="descripcion" rows={3} defaultValue={planta.descripcion ?? ""} className="fi-area" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Observaciones</span>
            <textarea name="observaciones" rows={2} defaultValue={planta.observaciones ?? ""} className="fi-area" />
          </label>
          <div className="sm:col-span-2 flex justify-end gap-3">
            <Link href="/admin/plantas" className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium">Cancelar</Link>
            <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Guardar cambios</button>
          </div>
      </form>
    </AdminModal>
  );
}
