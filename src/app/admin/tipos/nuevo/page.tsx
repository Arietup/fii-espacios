import Link from "next/link";
import AdminModal from "@/app/admin/_components/AdminModal";
import { createTipo } from "../actions";
export const metadata = { title: "Nuevo tipo | Espacios FII" };
export default function NuevoTipoPage() {
  return (
    <AdminModal title="Nuevo tipo de espacio" backHref="/admin/tipos" backLabel="Tipos">
      <form action={createTipo} className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">ID / Clave <span className="text-red-500">*</span></label>
            <input name="id" required className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" placeholder="ej: aula, sala-reuniones" />
            <p className="mt-1 text-xs text-[var(--text-muted)]">Slug único e inmutable: solo minúsculas y guiones.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Etiqueta (nombre visible) <span className="text-red-500">*</span></label>
            <input name="etiqueta" required className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" placeholder="ej: Aula de clases" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[var(--text)]">Descripción</label>
            <textarea name="descripcion" rows={2} className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" placeholder="Descripción breve" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Clase CSS de color <span className="text-red-500">*</span></label>
            <input name="color" required className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" placeholder="bg-[#8B5CF6]/12 text-[#7C3AED]" />
            <p className="mt-1 text-xs text-[var(--text-muted)]">Clases Tailwind para el badge (fondo y texto).</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Color accent (hex)</label>
            <input name="accent" className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" placeholder="#8B5CF6" defaultValue="#64748B" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Orden</label>
            <input name="orden" type="number" min="0" className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" defaultValue="0" />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <Link href="/admin/tipos" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--secondary)]">Cancelar</Link>
            <button type="submit" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">Crear tipo</button>
          </div>
      </form>
    </AdminModal>
  );
}
