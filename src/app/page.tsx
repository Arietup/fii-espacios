import Link from "next/link";
import Icon from "@/components/Icon";
import { fetchBloques, fetchEspacios } from "@/lib/espacios";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [bloques, espacios] = await Promise.all([fetchBloques(), fetchEspacios()]);
  const tipos = new Set(espacios.map((e) => e.tipo)).size;

  const KPIS = [
    { label: "Bloques registrados",  value: bloques.length,  icon: "building" as const, accent: "#2B6CB0", bg: "from-[#EDF6FF] to-[#DCEEFF]" },
    { label: "Espacios catalogados", value: espacios.length, icon: "home"     as const, accent: "#10B981", bg: "from-[#ECFDF5] to-[#DCFCE7]" },
    { label: "Tipos de espacio",     value: tipos,           icon: "archive"  as const, accent: "#8B5CF6", bg: "from-[#F5F3FF] to-[#EDE9FE]" },
    {
      label: "Plantas mapeadas",
      value: bloques.reduce((acc, b) => acc + b.plantas.length, 0),
      icon: "search" as const,
      accent: "#F59E0B",
      bg: "from-[#FFFBEB] to-[#FEF3C7]",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section className="brand-gradient scroll-reveal relative overflow-hidden rounded-2xl p-6 text-white shadow-[0_24px_60px_rgba(43,108,176,0.28)] sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <span className="badge-pill bg-white/15 text-white backdrop-blur-sm">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              Panel principal
            </span>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Encuentra cualquier espacio de la facultad
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
              Esta guia reune la informacion de los bloques A, B, C, D, E, F y G de la
              Facultad de Ingenieria Industrial: aulas, laboratorios, talleres, oficinas,
              auditorios y servicios.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/bloques"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[var(--primary)] shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.22)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2B6CB0]"
            >
              <Icon name="building" />
              Explorar bloques
            </Link>
            <Link
              href="/espacios"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2B6CB0]"
            >
              <Icon name="search" />
              Buscar espacio
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="kpi-card hover-scale p-5">
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{kpi.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">{kpi.value}</p>
              </div>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.bg}`}
                style={{ color: kpi.accent }}
              >
                <Icon name={kpi.icon} className="h-5 w-5" />
              </span>
            </div>
            <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--divider)]">
              <span className="block h-full rounded-full" style={{ width: "72%", background: kpi.accent }} />
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Inventario institucional
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">Bloques de la facultad</h2>
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{espacios.length} espacios registrados</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bloques.map((bloque) => {
            const total = espacios.filter((e) => e.bloqueId === bloque.id).length;
            return (
              <Link
                key={bloque.id}
                href={`/bloques/${bloque.id}`}
                className="surface-card surface-card-hover group flex h-full flex-col p-5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)] transition group-hover:bg-[var(--primary)] group-hover:text-white">
                    <Icon name="building" className="h-5 w-5" />
                  </div>
                  <span className="badge-pill bg-[var(--secondary)] text-[var(--text-secondary)]">
                    {total} espacios
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--text)] transition group-hover:text-[var(--primary)]">
                  {bloque.nombre}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{bloque.resumen}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="badge-pill border border-[var(--border-soft)] bg-white text-[var(--text-secondary)]">
                    {bloque.plantas.length === 1 ? "1 nivel" : `${bloque.plantas.length} niveles`}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                  Ver bloque
                  <Icon name="chevronRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">Organizacion de referencia</h2>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-secondary)] md:grid-cols-2">
          <p className="rounded-xl bg-[var(--secondary)] p-4">
            <strong className="text-[var(--text)]">Bloques A, B y C</strong>: conjunto principal con planta baja, primera planta y segunda planta.
          </p>
          <p className="rounded-xl bg-[var(--secondary)] p-4">
            <strong className="text-[var(--text)]">Bloque G de Aulas</strong>: edificio alargado de aulas en fila, con planta baja y planta alta.
          </p>
          <p className="rounded-xl bg-[var(--secondary)] p-4">
            <strong className="text-[var(--text)]">Bloque D y E</strong>: unidad con laboratorios, talleres y oficinas.
          </p>
          <p className="rounded-xl bg-[var(--secondary)] p-4">
            <strong className="text-[var(--text)]">Bloque F</strong>: nave de talleres con bodega y servicios, de un solo nivel.
          </p>
        </div>
      </section>
    </div>
  );
}
