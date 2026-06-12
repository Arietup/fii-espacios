import Link from "next/link";
import AdminModal from "@/app/admin/_components/AdminModal";
import { createEquipamiento } from "@/app/admin/catalogos-actions";

export const metadata = { title: "Nuevo equipamiento | Espacios FII" };

export default function NuevoEquipamientoPage() {
  return (
    <AdminModal title="Nuevo equipamiento" backHref="/admin/equipamientos" backLabel="Equipamientos">
      <form action={createEquipamiento} className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Nombre *</span>
          <input name="nombre" required className="h-10 w-full rounded-lg border border-[var(--border-soft)] px-3 text-sm" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Categoria</span>
          <input name="categoria" className="h-10 w-full rounded-lg border border-[var(--border-soft)] px-3 text-sm" />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
          <textarea name="descripcion" rows={3} className="w-full rounded-lg border border-[var(--border-soft)] px-3 py-2 text-sm" />
        </label>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link href="/admin/equipamientos" className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium">Cancelar</Link>
          <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Crear equipamiento</button>
        </div>
      </form>
    </AdminModal>
  );
}
