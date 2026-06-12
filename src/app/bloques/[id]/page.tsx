import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { auth } from "@/lib/auth";
import { fetchBloque, fetchBloqueDetalleImagenes, fetchEspaciosDeBloque } from "@/lib/espacios";
import EspacioCard from "@/components/EspacioCard";
import ImageCarousel from "@/components/ImageCarousel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bloque = await fetchBloque(id);
  return { title: bloque ? `${bloque.nombre} | Espacios FII` : "Bloque no encontrado" };
}

export default async function BloqueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [bloque, bloqueDetalle, session] = await Promise.all([fetchBloque(id), fetchBloqueDetalleImagenes(id), auth()]);
  if (!bloque) notFound();

  const isAdmin = session?.user.role === "ADMIN";
  const espacios = await fetchEspaciosDeBloque(bloque.id);

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <Link
              href="/bloques"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <Icon name="arrowLeft" />
              Volver a bloques
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Detalle de bloque
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">{bloque.nombre}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">{bloque.descripcion}</p>
          </div>
          <div className="grid min-w-60 grid-cols-2 gap-3">
            <div className="kpi-card p-4">
              <p className="relative text-xs font-medium text-[var(--text-muted)]">Plantas</p>
              <p className="relative mt-1 text-2xl font-semibold text-[var(--primary)]">{bloque.plantas.length}</p>
            </div>
            <div className="kpi-card p-4">
              <p className="relative text-xs font-medium text-[var(--text-muted)]">Espacios</p>
              <p className="relative mt-1 text-2xl font-semibold text-[var(--primary)]">{espacios.length}</p>
            </div>
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className="brand-gradient-soft scroll-reveal rounded-2xl border border-dashed border-[var(--primary)]/30 p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="badge-pill bg-white/70 text-[var(--primary)]">
                <Icon name="shield" className="h-3.5 w-3.5" />
                Acciones de administrador
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
                Editar contenido de {bloque.nombre}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                Los datos de este bloque se gestionan desde el panel administrativo. Haz clic en Editar para modificar textos, plantas o espacios.
              </p>
            </div>
            <Link
              href={`/admin/bloques`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <Icon name="edit" />
              Admin Bloques
            </Link>
          </div>
        </section>
      )}

      {bloqueDetalle && bloqueDetalle.imagenes.length > 0 && (
        <section className="surface-card overflow-hidden p-5 sm:p-6">
          <ImageCarousel
            imagenPrincipal={bloqueDetalle.imagenes[0]}
            imagenesSecundarias={bloqueDetalle.imagenes.slice(1)}
            alt={`Imagenes de ${bloque.nombre}`}
          />
        </section>
      )}

      {bloque.plantas.map((planta) => {
        const espaciosPlanta = espacios.filter((e) => e.planta === planta.nombre);
        const plantaDetalle = bloqueDetalle?.plantas.find((item) => item.id === planta.id || item.nombre === planta.nombre);
        const imagenPrincipal = plantaDetalle?.imagenes[0] ?? null;
        const imagenesSecundarias = plantaDetalle?.imagenes.slice(1) ?? [];

        return (
          <section key={planta.nombre} className="surface-card overflow-hidden">
            <div className="flex flex-col justify-between gap-3 border-b border-[var(--divider)] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Plano y espacios
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">{planta.nombre}</h2>
              </div>
              <span className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
                {espaciosPlanta.length} espacios
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {imagenPrincipal ? (
                <ImageCarousel
                  imagenPrincipal={imagenPrincipal}
                  imagenesSecundarias={imagenesSecundarias}
                  alt={`Plano de ${bloque.nombre} - ${planta.nombre}`}
                />
              ) : (
                <div className="overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--secondary)]">
                  <div className="aspect-[16/9] w-full">
                    <img
                      src={planta.imagen}
                      alt={`Plano de ${bloque.nombre} - ${planta.nombre}`}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                  <p className="border-t border-[var(--border-soft)] bg-white px-4 py-3 text-xs text-[var(--text-muted)]">
                    Plano de referencia - {bloque.nombre}, {planta.nombre}.
                  </p>
                </div>
              )}

              {espaciosPlanta.length > 0 && (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {espaciosPlanta.map((espacio) => (
                    <EspacioCard key={espacio.id} espacio={espacio} />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
