import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import {
  fetchBloqueConPlantas,
  fetchEquipamientos,
  fetchEstadosFisicos,
  fetchEspacioAdmin,
  fetchTipos,
  fetchUsos,
} from "@/lib/espacios";
import { updateEspacio } from "../../actions";
import EspacioForm from "../../_components/EspacioForm";

export const dynamic = "force-dynamic";

export default async function EditarEspacioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [espacio, bloques, tipos, estados, usos, equipamientos] = await Promise.all([
    fetchEspacioAdmin(id),
    fetchBloqueConPlantas(),
    fetchTipos(),
    fetchEstadosFisicos(),
    fetchUsos(),
    fetchEquipamientos(),
  ]);
  if (!espacio) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateEspacio(id, formData);
    redirect("/admin/espacios");
  }

  return (
    <AdminModal title={`Editar: ${espacio.nombre}`} backHref="/admin/espacios" backLabel="Espacios" size="xl">
      <EspacioForm
        action={action}
        bloques={bloques}
        tipos={tipos}
        estados={estados}
        usos={usos}
        equipamientos={equipamientos}
        espacio={{
          ...espacio,
          usos: espacio.usos.map((uso) => ({ usoId: uso.usoId })),
          equipamiento: espacio.equipamiento.map((item) => ({
            equipamientoId: item.equipamientoId,
            cantidad: item.cantidad,
            estado: item.estado,
            observaciones: item.observaciones,
          })),
        }}
      />
      <div className="mt-4">
        <Link href={`/admin/espacios/${espacio.id}`} className="text-sm font-medium text-[var(--primary)] hover:underline">Ver detalle administrativo</Link>
      </div>
    </AdminModal>
  );
}
