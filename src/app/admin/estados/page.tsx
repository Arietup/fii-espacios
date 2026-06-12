import Link from "next/link";
import Icon from "@/components/Icon";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import { fetchEstadosFisicosAdmin } from "@/lib/espacios";
import { deleteEstado, toggleEstado } from "@/app/admin/catalogos-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Estados fisicos | Espacios FII" };

export default async function AdminEstadosPage() {
  const estados = await fetchEstadosFisicosAdmin();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Estados fisicos"
        description="Gestiona el catalogo de estados de conservacion para espacios."
        actions={
          <Link href="/admin/estados/nuevo" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Icon name="plus" className="h-4 w-4" />Nuevo estado
          </Link>
        }
      />
      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-[var(--border-soft)] bg-[var(--secondary)] text-left">
              <tr>
                {["Nombre", "Color", "Orden", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-[var(--text-secondary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {estados.map((estado) => (
                <tr key={estado.id} className="hover:bg-[var(--secondary)]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{estado.nombre}</p>
                    <p className="text-xs text-[var(--text-muted)]">{estado.descripcion ?? "Sin descripcion"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                      <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ background: estado.color }} />
                      {estado.color}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{estado.orden}</td>
                  <td className="px-4 py-3">
                    <form action={toggleEstado.bind(null, estado.id, !estado.activo)}>
                      <button type="submit" className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${estado.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        <Icon name={estado.activo ? "toggleOn" : "toggleOff"} className="h-3.5 w-3.5" />
                        {estado.activo ? "Activo" : "Inactivo"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/estados/${estado.id}/editar`} className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Editar</Link>
                      <DeleteButton formAction={deleteEstado.bind(null, estado.id)} label={estado.nombre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
