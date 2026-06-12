import { notFound } from "next/navigation";
import ImagenesEntidadPage, { getPlantaImagenPageData } from "@/app/admin/imagenes/ImagenesEntidadPage";

export const dynamic = "force-dynamic";

export default async function PlantaImagenesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPlantaImagenPageData(id);
  if (!data) notFound();
  return <ImagenesEntidadPage entidad="PLANTA" entidadId={id} {...data} />;
}
