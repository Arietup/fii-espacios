import Link from "next/link";
import { redirect } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import { fetchBloqueConPlantas, fetchEquipamientos, fetchEstadosFisicos, fetchTiposActivos, fetchUsos } from "@/lib/espacios";
import { createEspacio } from "../actions";
import EspacioForm from "../_components/EspacioForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nuevo espacio | Espacios FII" };

export default async function NuevoEspacioPage() {
  const [bloques, tipos, estados, usos, equipamientos] = await Promise.all([
    fetchBloqueConPlantas(),
    fetchTiposActivos(),
    fetchEstadosFisicos(),
    fetchUsos(),
    fetchEquipamientos(),
  ]);

  async function action(formData: FormData) {
    "use server";
    await createEspacio(formData);
    redirect("/admin/espacios");
  }

  return (
    <AdminModal title="Nuevo espacio" backHref="/admin/espacios" backLabel="Espacios" size="xl">
      <EspacioForm action={action} bloques={bloques} tipos={tipos} estados={estados} usos={usos} equipamientos={equipamientos} />
      <div className="mt-4">
        <Link href="/admin/espacios" className="text-sm font-medium text-[var(--primary)] hover:underline">Volver sin guardar</Link>
      </div>
    </AdminModal>
  );
}
