import Link from "next/link";
import { notFound } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import { prisma } from "@/lib/prisma";
import { updateTipo } from "../../actions";
export const dynamic = "force-dynamic";
export default async function EditarTipoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tipo = await prisma.tipo.findUnique({ where: { id } });
  if (!tipo) notFound();
  const updateAction = updateTipo.bind(null, tipo.id);
  return (
    <AdminModal title={`Editar: ${tipo.etiqueta}`} backHref="/admin/tipos" backLabel="Tipos">
      <form action={updateAction} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[var(--text)]">ID</label>
            <p className="mt-1 rounded-lg border border-[var(--border-soft)] bg-[var(--secondary)] px-3 py-2 font-mono text-sm text-[var(--text-muted)]">{tipo.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Etiqueta <span className="text-red-500">*</span></label>
            <input name="etiqueta" required defaultValue={tipo.etiqueta} className="fi" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[var(--text)]">Descripción</label>
            <textarea name="descripcion" rows={2} defaultValue={tipo.descripcion ?? ""} className="fi-area" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Clase CSS color <span className="text-red-500">*</span></label>
            <input name="color" required defaultValue={tipo.color} className="fi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Color accent (hex)</label>
            <input name="accent" defaultValue={tipo.accent} className="fi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Orden</label>
            <input name="orden" type="number" min="0" defaultValue={tipo.orden} className="fi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text)]">Estado</label>
            <select name="activo" defaultValue={tipo.activo.toString()} className="fi fi-select">
              <option value="true">Activo</option><option value="false">Inactivo</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <Link href="/admin/tipos" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--secondary)]">Cancelar</Link>
            <button type="submit" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">Guardar cambios</button>
          </div>
      </form>
    </AdminModal>
  );
}
