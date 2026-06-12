import Link from "next/link";
import Icon from "@/components/Icon";
import { auth } from "@/lib/auth";
import { fetchBloques, fetchEspacios } from "@/lib/espacios";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bloques | Espacios FII",
};

export default async function BloquesPage() {
  const [session, bloques, espacios] = await Promise.all([
    auth(),
    fetchBloques(),
    fetchEspacios(),
  ]);
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Inventario por bloque
        </p>
        <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">Bloques de la facultad</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
              La Facultad de Ingenieria Industrial esta conformada por siete bloques. Selecciona uno para ver su distribucion por planta y los espacios que contiene.
            </p>
          </div>
          <Link
            href="/espacios"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-white px-5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <Icon name="search" />
            Buscar espacios
          </Link>
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
              <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Gestion de bloques y espacios</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                Los datos ahora se gestionan desde la base de datos. Accede al panel admin para crear, editar o desactivar bloques y espacios.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/bloques"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              >
                <Icon name="edit" />
                Admin Bloques
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {bloques.map((bloque) => {
          const espaciosBloque = espacios.filter((e) => e.bloqueId === bloque.id);
          return (
            <Link
              key={bloque.id}
              href={`/bloques/${bloque.id}`}
              className="surface-card surface-card-hover group p-5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--divider)] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)] transition group-hover:bg-[var(--primary)] group-hover:text-white">
                    <Icon name="building" className="h-5 w-5" />
                  </span>
                  <h2 className="text-lg font-semibold text-[var(--text)] transition group-hover:text-[var(--primary)]">
                    {bloque.nombre}
                  </h2>
                </div>
                <span className="badge-pill shrink-0 bg-[var(--secondary)] text-[var(--text-secondary)]">
                  {espaciosBloque.length} espacios
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{bloque.descripcion}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {bloque.plantas.map((planta) => (
                  <span
                    key={planta.nombre}
                    className="badge-pill border border-[var(--border-soft)] bg-white text-[var(--text-secondary)]"
                  >
                    {planta.nombre}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
