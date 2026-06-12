import AdminHeader from "@/app/admin/_components/AdminHeader";
import { fetchPlantasAdmin, fetchBloquesAdmin } from "@/lib/espacios";
import PlantasCrudClient from "./PlantasCrudClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Plantas | Espacios FII" };

export default async function AdminPlantasPage() {
  const [plantas, bloques] = await Promise.all([
    fetchPlantasAdmin(),
    fetchBloquesAdmin(),
  ]);

  const bloquesSimple = bloques.map((b) => ({ id: b.id, nombre: b.nombre }));

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title="Plantas"
        description="Gestiona niveles físicos por bloque. Mueve plantas entre bloques manteniendo sus espacios asociados."
      />
      <PlantasCrudClient plantas={plantas} bloques={bloquesSimple} />
    </div>
  );
}
