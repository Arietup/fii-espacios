import Link from "next/link";
import Icon from "@/components/Icon";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import { fetchUsosAdmin } from "@/lib/espacios";
import { deleteUso, toggleUso } from "@/app/admin/catalogos-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usos de espacio | Espacios FII" };

export default async function AdminUsosPage() {
  const usos = await fetchUsosAdmin();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Usos de espacio"
        description="Gestiona el catalogo de usos que pueden asociarse a uno o varios espacios."
        actions={
          <Link href="/admin/usos/nuevo" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Icon name="plus" className="h-4 w-4" />Nuevo uso
          </Link>
        }
      />
      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-[var(--border-soft)] bg-[var(--secondary)] text-left">
              <tr>
                {["Nombre", "Descripcion", "Orden", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-[var(--text-secondary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {usos.map((uso) => (
                <tr key={uso.id} className="hover:bg-[var(--secondary)]">
                  <td className="px-4 py-3 font-medium text-[var(--text)]">{uso.nombre}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{uso.descripcion ?? "Sin descripcion"}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{uso.orden}</td>
                  <td className="px-4 py-3">
                    <form action={toggleUso.bind(null, uso.id, !uso.activo)}>
                      <button type="submit" className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${uso.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        <Icon name={uso.activo ? "toggleOn" : "toggleOff"} className="h-3.5 w-3.5" />
                        {uso.activo ? "Activo" : "Inactivo"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/usos/${uso.id}/editar`} className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Editar</Link>
                      <DeleteButton formAction={deleteUso.bind(null, uso.id)} label={uso.nombre} />
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
