"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { TIPOS_INFO, TipoEspacio } from "@/data/tipos";
import EspacioCard from "@/components/EspacioCard";
import type { Bloque, Espacio } from "@/data/tipos";

interface Props {
  bloques: Bloque[];
  espacios: Espacio[];
}

export default function EspaciosBuscador({ bloques, espacios }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [bloqueId, setBloqueId] = useState("todos");
  const [tipo, setTipo] = useState<TipoEspacio | "todos">("todos");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return espacios.filter((espacio) => {
      if (bloqueId !== "todos" && espacio.bloqueId !== bloqueId) return false;
      if (tipo !== "todos" && espacio.tipo !== tipo) return false;
      if (texto) {
        const haystack = `${espacio.codigo} ${espacio.nombre} ${espacio.descripcion} ${espacio.planta}`.toLowerCase();
        if (!haystack.includes(texto)) return false;
      }
      return true;
    });
  }, [busqueda, bloqueId, tipo, espacios]);

  function withLoading(name: string, callback: () => void | Promise<void>) {
    setActionLoading(name);
    Promise.resolve(callback()).finally(() => {
      window.setTimeout(() => setActionLoading(null), 350);
    });
  }

  function downloadResults() {
    const blob = new Blob([JSON.stringify(resultados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "espacios-fii-resultados.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function shareResults() {
    if (navigator.share) {
      await navigator.share({
        title: "Resultados de espacios FII",
        text: `${resultados.length} resultados encontrados en Espacios FII.`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  const actions = [
    { key: "pdf",      label: "Exportar PDF", icon: "file"     as const, run: () => window.print() },
    { key: "share",    label: "Compartir",    icon: "share"    as const, run: shareResults },
    { key: "print",    label: "Imprimir",     icon: "printer"  as const, run: () => window.print() },
    { key: "download", label: "Descargar",    icon: "download" as const, run: downloadResults },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal overflow-hidden">
        <div className="border-b border-[var(--divider)] px-5 py-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Resultados</p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Consulta de espacios</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Generado el {new Date().toLocaleDateString("es-EC")} con {resultados.length} resultado{resultados.length === 1 ? "" : "s"}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => withLoading(action.key, action.run)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-70"
                  disabled={actionLoading !== null}
                >
                  {actionLoading === action.key ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
                  ) : (
                    <Icon name={action.icon} />
                  )}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-[var(--secondary)]/50 p-5 sm:grid-cols-[1.4fr_1fr_1fr] sm:p-6">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Busqueda</span>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-[var(--border-soft)] bg-white px-3 transition hover:border-[var(--text-muted)] focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/12">
              <Icon name="search" className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, codigo o descripcion"
                className="h-full w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Bloque</span>
            <select
              value={bloqueId}
              onChange={(e) => setBloqueId(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-white px-3 text-sm text-[var(--text)] transition hover:border-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/12"
            >
              <option value="todos">Todos los bloques</option>
              {bloques.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Tipo</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoEspacio | "todos")}
              className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-white px-3 text-sm text-[var(--text)] transition hover:border-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/12"
            >
              <option value="todos">Todos los tipos</option>
              {(Object.keys(TIPOS_INFO) as TipoEspacio[]).map((t) => (
                <option key={t} value={t}>
                  {TIPOS_INFO[t].etiqueta}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {resultados.length === 0 ? (
        <div className="surface-card border-dashed p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--text-muted)]">
            <Icon name="search" className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-[var(--text)]">No se encontraron espacios</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Ajusta la busqueda o cambia los filtros para ampliar la consulta.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resultados.map((espacio) => (
            <EspacioCard key={espacio.id} espacio={espacio} />
          ))}
        </div>
      )}
    </div>
  );
}
