import Link from "next/link";
import Icon from "@/components/Icon";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import { fetchPlantasAdmin } from "@/lib/espacios";
import { deletePlanta, togglePlanta } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Plantas | Espacios FII" };

export default async function AdminPlantasPage() {
  const plantas = await fetchPlantasAdmin();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Plantas"
        description="Gestiona niveles fisicos por bloque y mueve plantas entre bloques manteniendo sus espacios asociados."
        actions={
          <Link href="/admin/plantas/nueva" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Icon name="plus" className="h-4 w-4" />Nueva planta
          </Link>
        }
      />
      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-[var(--border-soft)] bg-[var(--secondary)] text-left">
              <tr>
                {["Planta", "Bloque", "Nivel", "Espacios", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-[var(--text-secondary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {plantas.map((planta) => (
                <tr key={planta.id} className="hover:bg-[var(--secondary)]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{planta.nombre}</p>
                    <p className="font-mono text-xs text-[var(--text-muted)]">{planta.codigo ?? planta.imagenUrl}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{planta.bloque.nombre}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{planta.nivel}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{planta._count.espacios}</td>
                  <td className="px-4 py-3">
                    <form action={togglePlanta.bind(null, planta.id, !planta.activo)}>
                      <button type="submit" className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${planta.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        <Icon name={planta.activo ? "toggleOn" : "toggleOff"} className="h-3.5 w-3.5" />
                        {planta.activo ? "Activo" : "Inactivo"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/plantas/${planta.id}/editar`} className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">Editar</Link>
                      <DeleteButton formAction={deletePlanta.bind(null, planta.id)} label={planta.nombre} />
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
