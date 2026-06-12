import Link from "next/link";
import Icon from "@/components/Icon";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import { fetchTipos } from "@/lib/espacios";
import { toggleTipo, deleteTipo } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tipos de espacio | Espacios FII" };

export default async function AdminTiposPage() {
  const tipos = await fetchTipos();
  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Tipos de espacio"
        description="Gestiona los tipos que clasifican los espacios de la facultad."
        actions={
          <Link href="/admin/tipos/nuevo" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Icon name="plus" className="h-4 w-4" />Nuevo tipo
          </Link>
        }
      />
      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-soft)] bg-[var(--secondary)] text-left">
              <tr>
                {["ID","Etiqueta","Accent","Orden","Estado","Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-[var(--text-secondary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {tipos.map((tipo) => {
                const toggleAction = toggleTipo.bind(null, tipo.id, !tipo.activo);
                const deleteAction = deleteTipo.bind(null, tipo.id);
                return (
                  <tr key={tipo.id} className="hover:bg-[var(--secondary)]">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{tipo.id}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-pill ${tipo.color}`}>{tipo.etiqueta}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ background: tipo.accent }} />
                        <span className="font-mono text-xs text-[var(--text-muted)]">{tipo.accent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{tipo.orden}</td>
                    <td className="px-4 py-3">
                      <form action={toggleAction}>
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            tipo.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon name={tipo.activo ? "toggleOn" : "toggleOff"} className="h-3.5 w-3.5" />
                          {tipo.activo ? "Activo" : "Inactivo"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/tipos/${tipo.id}/editar`} className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Editar</Link>
                        <DeleteButton formAction={deleteAction} label={tipo.etiqueta} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {tipos.length === 0 && (<tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">Sin tipos registrados.</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
