import { notFound } from "next/navigation";
import ImagenesEntidadPage, { getBloqueImagenPageData } from "@/app/admin/imagenes/ImagenesEntidadPage";

export const dynamic = "force-dynamic";

export default async function BloqueImagenesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBloqueImagenPageData(id);
  if (!data) notFound();
  return <ImagenesEntidadPage entidad="BLOQUE" entidadId={id} {...data} />;
}
