import Link from "next/link";
import Icon from "@/components/Icon";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import { fetchEquipamientosAdmin } from "@/lib/espacios";
import { deleteEquipamiento, toggleEquipamiento } from "@/app/admin/catalogos-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Equipamientos | Espacios FII" };

export default async function AdminEquipamientosPage() {
  const items = await fetchEquipamientosAdmin();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Equipamientos"
        description="Gestiona los recursos fisicos que se asignan a los espacios."
        actions={
          <Link href="/admin/equipamientos/nuevo" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Icon name="plus" className="h-4 w-4" />Nuevo equipamiento
          </Link>
        }
      />
      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-[var(--border-soft)] bg-[var(--secondary)] text-left">
              <tr>
                {["Nombre", "Categoria", "Descripcion", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-[var(--text-secondary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--secondary)]">
                  <td className="px-4 py-3 font-medium text-[var(--text)]">{item.nombre}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{item.categoria ?? "General"}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{item.descripcion ?? "Sin descripcion"}</td>
                  <td className="px-4 py-3">
                    <form action={toggleEquipamiento.bind(null, item.id, !item.activo)}>
                      <button type="submit" className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${item.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        <Icon name={item.activo ? "toggleOn" : "toggleOff"} className="h-3.5 w-3.5" />
                        {item.activo ? "Activo" : "Inactivo"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/equipamientos/${item.id}/editar`} className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Editar</Link>
                      <DeleteButton formAction={deleteEquipamiento.bind(null, item.id)} label={item.nombre} />
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
