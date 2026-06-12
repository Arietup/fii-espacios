import Link from "next/link";
import AdminModal from "@/app/admin/_components/AdminModal";
import { createUso } from "@/app/admin/catalogos-actions";

export const metadata = { title: "Nuevo uso | Espacios FII" };

export default function NuevoUsoPage() {
  return (
    <AdminModal title="Nuevo uso de espacio" backHref="/admin/usos" backLabel="Usos">
      <form action={createUso} className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Nombre *</span>
          <input name="nombre" required className="fi" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Orden</span>
          <input name="orden" type="number" defaultValue="0" className="fi" />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
          <textarea name="descripcion" rows={3} className="fi-area" />
        </label>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link href="/admin/usos" className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium">Cancelar</Link>
          <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Crear uso</button>
        </div>
      </form>
    </AdminModal>
  );
}
