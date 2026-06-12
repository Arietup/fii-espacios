import Link from "next/link";
import AdminModal from "@/app/admin/_components/AdminModal";
import { fetchBloqueConPlantas } from "@/lib/espacios";
import { createPlanta } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nueva planta | Espacios FII" };

export default async function NuevaPlantaPage() {
  const bloques = await fetchBloqueConPlantas();

  return (
    <AdminModal title="Nueva planta" backHref="/admin/plantas" backLabel="Plantas" size="xl">
      <form action={createPlanta} className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Bloque *</span>
            <select name="bloqueId" required className="fi fi-select">
              <option value="">Selecciona un bloque</option>
              {bloques.map((bloque) => <option key={bloque.id} value={bloque.id}>{bloque.nombre}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Nombre *</span>
            <input name="nombre" required className="fi" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Codigo</span>
            <input name="codigo" className="fi" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[var(--text)]">Nivel</span>
            <input name="nivel" type="number" defaultValue="0" className="fi" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Imagen / plano URL *</span>
            <input name="imagenUrl" required placeholder="/planos/bloque-a-b-c-planta-baja.svg" className="fi" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
            <textarea name="descripcion" rows={3} className="fi-area" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Observaciones</span>
            <textarea name="observaciones" rows={2} className="fi-area" />
          </label>
          <div className="sm:col-span-2 flex justify-end gap-3">
            <Link href="/admin/plantas" className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium">Cancelar</Link>
            <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Crear planta</button>
          </div>
      </form>
    </AdminModal>
  );
}
