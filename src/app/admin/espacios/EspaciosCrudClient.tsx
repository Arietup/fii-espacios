"use client";

import { useState, useMemo } from "react";
import Icon from "@/components/Icon";
import { createEspacio, updateEspacio, toggleEspacio, deleteEspacio } from "./actions";
import { TIPOS_INFO } from "@/data/tipos";
import type { TipoEspacio } from "@/data/tipos";

type Planta  = { id: string; nombre: string; nivel: number };
type Bloque  = { id: string; slug: string; nombre: string; plantas: Planta[] };
type Tipo    = { id: string; etiqueta: string };
type Espacio = {
  id: string;
  slug: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  capacidad: number | null;
  activo: boolean;
  tipoId: string;
  tipo: Tipo;
  bloqueId: string;
  bloque: { id: string; slug: string; nombre: string };
  planta: { id: string; nombre: string };
};

const fieldClass =
  "h-11 w-full rounded-xl border border-[var(--border-soft)] bg-white px-3 text-sm text-[var(--text)] transition placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/12";

const areaClass =
  "w-full rounded-xl border border-[var(--border-soft)] bg-white px-3 py-2 text-sm text-[var(--text)] transition placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/12 resize-none";

export default function EspaciosCrudClient({
  espacios,
  bloques,
  tipos,
}: {
  espacios: Espacio[];
  bloques: Bloque[];
  tipos: Tipo[];
}) {
  const [modalOpen, setModalOpen]       = useState(false);
  const [selected, setSelected]         = useState<Espacio | null>(null);
  const [pending, setPending]           = useState(false);
  const [busqueda, setBusqueda]         = useState("");
  const [filtroBloque, setFiltroBloque] = useState("todos");
  const [filtroTipo, setFiltroTipo]     = useState("todos");

  // Formulario cascada bloque → planta
  const [formBloqueId, setFormBloqueId] = useState("");
  const [formPlantaId, setFormPlantaId] = useState("");
  const plantasDisponibles = useMemo(
    () => bloques.find((b) => b.id === formBloqueId)?.plantas ?? [],
    [bloques, formBloqueId],
  );

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return espacios.filter((e) => {
      if (filtroBloque !== "todos" && e.bloque.id !== filtroBloque) return false;
      if (filtroTipo   !== "todos" && e.tipoId !== filtroTipo)      return false;
      if (texto) {
        const hay = `${e.codigo} ${e.nombre} ${e.descripcion} ${e.planta.nombre}`.toLowerCase();
        if (!hay.includes(texto)) return false;
      }
      return true;
    });
  }, [espacios, busqueda, filtroBloque, filtroTipo]);

  function openCreate() {
    setSelected(null);
    const firstBloqueId = bloques[0]?.id ?? "";
    setFormBloqueId(firstBloqueId);
    setFormPlantaId(bloques[0]?.plantas[0]?.id ?? "");
    setModalOpen(true);
  }

  function openEdit(e: Espacio) {
    setSelected(e);
    setFormBloqueId(e.bloqueId);
    setFormPlantaId(e.planta.id);
    setModalOpen(true);
  }

  function closeModal() { setModalOpen(false); setSelected(null); }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      if (selected) await updateEspacio(selected.id, formData);
      else          await createEspacio(formData);
      closeModal();
    } finally { setPending(false); }
  }

  async function handleToggle(e: Espacio) { await toggleEspacio(e.id, !e.activo); }

  async function handleDelete(e: Espacio) {
    if (!confirm(`¿Eliminar "${e.nombre}"?`)) return;
    await deleteEspacio(e.id);
  }

  const tipoInfo = (tipoId: string) =>
    TIPOS_INFO[tipoId as TipoEspacio] ?? { etiqueta: tipoId, color: "", accent: "#888" };

  return (
    <>
      {/* ── Toolbar + filtros ────────────────────────────────────────────── */}
      <section className="surface-card scroll-reveal overflow-hidden">
        <div className="border-b border-[var(--divider)] px-5 py-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Bloque de acciones</p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Gestion del CRUD</h2>
            </div>
            <button type="button" onClick={openCreate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
              <Icon name="plus" />
              Nuevo espacio
            </button>
          </div>
        </div>

        <div className="grid gap-3 bg-[var(--secondary)]/50 p-5 sm:grid-cols-3 sm:p-6">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Busqueda</span>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-[var(--border-soft)] bg-white px-3 transition focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/12">
              <Icon name="search" className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Código, nombre..." className="h-full w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none" />
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Bloque</span>
            <select value={filtroBloque} onChange={(e) => setFiltroBloque(e.target.value)} className={fieldClass}>
              <option value="todos">Todos</option>
              {bloques.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text)]">Tipo</span>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className={fieldClass}>
              <option value="todos">Todos</option>
              {tipos.map((t) => <option key={t.id} value={t.id}>{t.etiqueta}</option>)}
            </select>
          </label>
        </div>
      </section>

      {/* ── Tabla ───────────────────────────────────────────────────────── */}
      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--divider)] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Listado</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Espacios registrados</h2>
          </div>
          <span className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">{resultados.length} resultado{resultados.length !== 1 && "s"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[var(--secondary)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Codigo</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Bloque</th>
                <th className="px-4 py-3 font-semibold">Planta</th>
                <th className="px-4 py-3 font-semibold">Cap.</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((e) => {
                const info = tipoInfo(e.tipoId);
                return (
                  <tr key={e.id} className="border-t border-[var(--divider)] transition hover:bg-[var(--primary-light)]/40">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">{e.codigo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-[220px] truncate font-medium text-[var(--text)]">{e.nombre}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge-pill ${info.color}`}>{info.etiqueta}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{e.bloque.nombre}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{e.planta.nombre}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{e.capacidad ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-pill ${e.activo ? "bg-green-100 text-green-700" : "bg-[var(--secondary)] text-[var(--text-muted)]"}`}>
                        {e.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button type="button" onClick={() => openEdit(e)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--border-soft)] px-2.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                          <Icon name="edit" className="h-3 w-3" />Editar
                        </button>
                        <button type="button" onClick={() => handleToggle(e)}
                          className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 ${
                            e.activo ? "border-amber-200 text-amber-700 hover:bg-amber-50 focus:ring-amber-400"
                                     : "border-green-200 text-green-700 hover:bg-green-50 focus:ring-green-400"
                          }`}>
                          <Icon name={e.activo ? "toggleOn" : "toggleOff"} className="h-3 w-3" />
                          {e.activo ? "Desactivar" : "Activar"}
                        </button>
                        <button type="button" onClick={() => handleDelete(e)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--danger)]/25 px-2.5 text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-light)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)]">
                          <Icon name="trash" className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {resultados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-[var(--text-muted)]">
                    No se encontraron espacios con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modal crear / editar espacio ─────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--text)]/45 px-4 py-6 backdrop-blur-sm">
          <section
            role="dialog" aria-modal="true"
            className="w-full max-w-2xl overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.24)]"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--divider)] bg-[var(--primary-light)]/60 px-6 py-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(43,108,176,0.3)]">
                  <Icon name={selected ? "edit" : "plus"} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                    {selected ? "Editar registro" : "Nuevo registro"}
                  </p>
                  <h3 className="mt-0.5 text-xl font-semibold text-[var(--text)]">
                    {selected ? `Editar: ${selected.nombre}` : "Crear espacio"}
                  </h3>
                </div>
              </div>
              <button type="button" onClick={closeModal}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <form action={handleSubmit}>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                {/* Código */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Código</span>
                  <input name="codigo" required defaultValue={selected?.codigo ?? ""} placeholder="A-PB-01" className={fieldClass} />
                </label>
                {/* Nombre */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Nombre</span>
                  <input name="nombre" required defaultValue={selected?.nombre ?? ""} placeholder="Decanato" className={fieldClass} />
                </label>
                {/* Slug (solo crear) */}
                {!selected && (
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--text)]">Slug / ID (URL) — opcional</span>
                    <input name="slug" placeholder="a-pb-decanato (se genera automáticamente)" className={fieldClass} />
                  </label>
                )}
                {/* Tipo */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Tipo</span>
                  <select name="tipoId" required defaultValue={selected?.tipoId ?? ""} className={fieldClass}>
                    <option value="">— Selecciona —</option>
                    {tipos.map((t) => <option key={t.id} value={t.id}>{t.etiqueta}</option>)}
                  </select>
                </label>
                {/* Capacidad */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Capacidad (personas)</span>
                  <input type="number" name="capacidad" min={1} defaultValue={selected?.capacidad ?? ""} placeholder="40" className={fieldClass} />
                </label>
                {/* Bloque */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Bloque</span>
                  <select name="bloqueId" required value={formBloqueId}
                    onChange={(ev) => {
                      setFormBloqueId(ev.target.value);
                      const firstPlanta = bloques.find((b) => b.id === ev.target.value)?.plantas[0];
                      setFormPlantaId(firstPlanta?.id ?? "");
                    }} className={fieldClass}>
                    <option value="">— Selecciona —</option>
                    {bloques.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                  </select>
                </label>
                {/* Planta (cascada controlada) */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Planta</span>
                  <select name="plantaId" required value={formPlantaId}
                    onChange={(ev) => setFormPlantaId(ev.target.value)} className={fieldClass}>
                    <option value="">— Selecciona bloque primero —</option>
                    {plantasDisponibles.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </label>
                {/* Descripción */}
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[var(--text)]">Descripción</span>
                  <textarea name="descripcion" required rows={3} defaultValue={selected?.descripcion ?? ""} placeholder="Descripción del espacio..." className={areaClass} />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--divider)] bg-[var(--secondary)] px-6 py-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-white px-5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
                  Cancelar
                </button>
                <button type="submit" disabled={pending}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:-translate-y-0.5 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
                  <Icon name="checkCircle" className="h-4 w-4" />
                  {pending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
