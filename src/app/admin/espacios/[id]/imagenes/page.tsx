import { notFound } from "next/navigation";
import ImagenesEntidadPage, { getEspacioImagenPageData } from "@/app/admin/imagenes/ImagenesEntidadPage";

export const dynamic = "force-dynamic";

export default async function EspacioImagenesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getEspacioImagenPageData(id);
  if (!data) notFound();
  return <ImagenesEntidadPage entidad="ESPACIO" entidadId={id} {...data} />;
}
