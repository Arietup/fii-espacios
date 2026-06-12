import Link from "next/link";
import Icon from "@/components/Icon";
import { Espacio, TIPOS_INFO } from "@/data/tipos";

export default function EspacioCard({ espacio }: { espacio: Espacio }) {
  const tipoInfo = TIPOS_INFO[espacio.tipo];

  return (
    <Link
      href={`/espacios/${espacio.id}`}
      className="surface-card surface-card-hover group relative flex h-full flex-col overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: tipoInfo.accent }}
      />

      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-semibold"
            style={{ background: `${tipoInfo.accent}1f`, color: tipoInfo.accent }}
          >
            <Icon name="building" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {espacio.codigo}
            </p>
            <h3 className="mt-0.5 truncate text-base font-semibold text-[var(--text)] transition group-hover:text-[var(--primary)]">
              {espacio.nombre}
            </h3>
          </div>
        </div>
        <span className={`badge-pill shrink-0 ${tipoInfo.color}`}>{tipoInfo.etiqueta}</span>
      </div>

      <p className="line-clamp-3 px-4 text-sm leading-6 text-[var(--text-secondary)]">
        {espacio.descripcion}
      </p>

      <div className="mt-4 grid gap-2 px-4 text-xs sm:grid-cols-2">
        <span className="rounded-xl bg-[var(--secondary)] px-3 py-2 text-[var(--text-secondary)]">
          <span className="block font-medium text-[var(--text-muted)]">Planta</span>
          <span className="font-semibold text-[var(--text)]">{espacio.planta}</span>
        </span>
        <span className="rounded-xl bg-[var(--secondary)] px-3 py-2 text-[var(--text-secondary)]">
          <span className="block font-medium text-[var(--text-muted)]">Capacidad</span>
          <span className="font-semibold text-[var(--text)]">
            {espacio.capacidad ? `${espacio.capacidad} personas` : "No definida"}
          </span>
        </span>
      </div>

      <span className="mt-4 inline-flex items-center gap-2 px-4 pb-4 text-sm font-semibold text-[var(--primary)]">
        Ver detalle
        <Icon name="chevronRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
