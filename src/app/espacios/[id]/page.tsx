import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import QuickActions from "@/components/QuickActions";
import { fetchBloque, fetchEspacio, fetchEspacioDetalle, fetchEspaciosDeBloque } from "@/lib/espacios";
import { TIPOS_INFO } from "@/data/tipos";
import EspacioCard from "@/components/EspacioCard";
import ImageCarousel from "@/components/ImageCarousel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const espacio = await fetchEspacio(id);
  return { title: espacio ? `${espacio.nombre} | Espacios FII` : "Espacio no encontrado" };
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: "building" | "home" | "users" | "archive" | "layers" | "zap";
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--secondary)] px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--primary)] shadow-sm">
        <Icon name={icon} className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-semibold text-[var(--text)]">{value}</dd>
      </div>
    </div>
  );
}

export default async function EspacioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detalle = await fetchEspacioDetalle(id);
  const espacio = await fetchEspacio(id);
  if (!espacio) notFound();
  if (!detalle || !detalle.activo) notFound();

  const bloque = await fetchBloque(detalle.bloque.slug);
  const planta = bloque?.plantas.find((p) => p.nombre === detalle.planta.nombre);
  const imagenPrincipal = detalle.imagenes[0] ?? detalle.planta.imagenes[0] ?? null;
  const imagenesSecundarias = detalle.imagenes.length > 1 ? detalle.imagenes.slice(1) : [];
  const imagenFallback = planta?.imagen ?? bloque?.imagen ?? "";
  const tipoInfo = TIPOS_INFO[espacio.tipo] ?? { etiqueta: detalle.tipo.etiqueta, color: detalle.tipo.color, accent: detalle.tipo.accent };

  const todosEnBloque = await fetchEspaciosDeBloque(espacio.bloqueId);
  const otrosEnBloque = todosEnBloque.filter(
    (e) => e.id !== espacio.id && e.planta === espacio.planta,
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal relative overflow-hidden p-6 sm:p-7">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: tipoInfo.accent }} />
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <Link
              href="/espacios"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <Icon name="arrowLeft" />
              Volver al buscador
            </Link>
            <p className="mt-5 font-mono text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">{detalle.codigo}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">{detalle.nombre}</h1>
              <span className={`badge-pill ${tipoInfo.color}`}>{tipoInfo.etiqueta}</span>
              <span className={`badge-pill ${detalle.accesoPublico ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {detalle.accesoPublico ? "Publico" : "Restringido"}
              </span>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">{detalle.descripcion}</p>
          </div>

          <QuickActions
            title={detalle.nombre}
            filename={`${detalle.slug}.json`}
            payload={{ espacio: detalle, bloque: bloque?.nombre ?? null }}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="surface-card overflow-hidden">
          <div className="border-b border-[var(--divider)] px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Ubicacion visual
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Plano de referencia</h2>
          </div>
          <div className="p-5 sm:p-6">
            {bloque && (
              <div className="overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--secondary)]">
                {imagenPrincipal ? (
                  <ImageCarousel
                    imagenPrincipal={imagenPrincipal}
                    imagenesSecundarias={imagenesSecundarias}
                    alt={`Imagenes de ${detalle.nombre}`}
                  />
                ) : (
                  <>
                    <div className="aspect-[16/9] w-full">
                      <img
                        src={imagenFallback}
                        alt={`Plano de ${bloque.nombre} - ${detalle.planta.nombre}`}
                        className="h-full w-full object-contain p-3"
                      />
                    </div>
                    <p className="border-t border-[var(--border-soft)] bg-white px-4 py-3 text-xs text-[var(--text-muted)]">
                      Ubicacion de referencia dentro del {bloque.nombre} - {detalle.planta.nombre}.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        <aside className="surface-card overflow-hidden xl:h-fit">
          <div className="border-b border-[var(--divider)] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Informacion</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Datos del espacio</h2>
          </div>
          <dl className="grid gap-3 p-5">
            <InfoTile
              icon="building"
              label="Bloque"
              value={
                bloque ? (
                  <Link href={`/bloques/${bloque.id}`} className="text-[var(--primary)] hover:underline">
                    {bloque.nombre}
                  </Link>
                ) : (
                  "No definido"
                )
              }
            />
            <InfoTile icon="home"    label="Planta"    value={detalle.planta.nombre} />
            <InfoTile icon="archive" label="Tipo"      value={tipoInfo.etiqueta} />
            <InfoTile
              icon="users"
              label="Capacidad"
              value={detalle.capacidad ? `${detalle.capacidad} personas` : "No definida"}
            />
          </dl>
        </aside>
      </div>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-[var(--divider)] px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Caracteristicas</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Datos fisicos y funcionales</h2>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile icon="users" label="Puestos" value={detalle.cantidadPuestos ?? "No definido"} />
          <InfoTile icon="archive" label="Area" value={detalle.areaM2 ? `${detalle.areaM2} m2` : "No definida"} />
          <InfoTile icon="layers" label="Medidas" value={[detalle.largoCm, detalle.anchoCm, detalle.altoCm].some(Boolean) ? `${detalle.largoCm ?? "-"} x ${detalle.anchoCm ?? "-"} x ${detalle.altoCm ?? "-"} cm` : "No definidas"} />
          <InfoTile icon="zap" label="Estado fisico" value={detalle.estadoFisico?.nombre ?? "No definido"} />
        </div>
        {(detalle.usos.length > 0 || detalle.equipamiento.length > 0 || detalle.comentarios.length > 0) && (
          <div className="grid gap-5 border-t border-[var(--divider)] p-5 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Usos</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {detalle.usos.length > 0 ? detalle.usos.map((uso) => (
                  <span key={uso.usoId} className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">{uso.uso.nombre}</span>
                )) : <p className="text-sm text-[var(--text-muted)]">Sin usos registrados.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Equipamiento</h3>
              <div className="mt-3 grid gap-2">
                {detalle.equipamiento.length > 0 ? detalle.equipamiento.map((item) => (
                  <p key={item.id} className="rounded-lg bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text)]">{item.equipamiento.nombre}</span> x {item.cantidad}
                  </p>
                )) : <p className="text-sm text-[var(--text-muted)]">Sin equipamiento registrado.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Comentarios publicos</h3>
              <div className="mt-3 grid gap-2">
                {detalle.comentarios.length > 0 ? detalle.comentarios.map((comentario) => (
                  <p key={comentario.id} className="rounded-lg bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]">{comentario.comentario}</p>
                )) : <p className="text-sm text-[var(--text-muted)]">Sin comentarios publicos.</p>}
              </div>
            </div>
          </div>
        )}
      </section>

      {otrosEnBloque.length > 0 && (
        <section className="surface-card overflow-hidden">
          <div className="border-b border-[var(--divider)] px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Relacionados</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">
              Otros espacios en {bloque?.nombre} - {detalle.planta.nombre}
            </h2>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {otrosEnBloque.map((e) => (
              <EspacioCard key={e.id} espacio={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
