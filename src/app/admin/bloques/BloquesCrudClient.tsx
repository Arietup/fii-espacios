"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";
import AdminFormModal from "@/app/admin/_components/AdminFormModal";
import {
  createBloque,
  updateBloque,
  toggleBloque,
  deleteBloque,
  createPlanta,
  updatePlanta,
  deletePlanta,
} from "./actions";

type Planta = { id: string; nombre: string; nivel: number; imagenUrl: string };
type Bloque = {
  id: string;
  slug: string;
  nombre: string;
  resumen: string;
  descripcion: string;
  activo: boolean;
  orden: number;
  plantas: Planta[];
  _count: { espacios: number };
};

const fieldClass = "fi";
const areaClass = "fi-area";

type ModalMode = "create" | "edit" | "plantas" | null;

export default function BloquesCrudClient({ bloques }: { bloques: Bloque[] }) {
  const [modalMode, setModalMode]       = useState<ModalMode>(null);
  const [selected, setSelected]         = useState<Bloque | null>(null);
  const [plantaMode, setPlantaMode]     = useState<"create" | "edit" | null>(null);
  const [selectedPlanta, setSelectedPlanta] = useState<Planta | null>(null);
  const [pending, setPending]           = useState(false);

  function openCreate() { setSelected(null); setModalMode("create"); }
  function openEdit(b: Bloque) { setSelected(b); setModalMode("edit"); }
  function openPlantas(b: Bloque) {
    setSelected(b); setModalMode("plantas"); setPlantaMode(null); setSelectedPlanta(null);
  }
  function closeModal() {
    setModalMode(null); setSelected(null); setPlantaMode(null); setSelectedPlanta(null);
  }

  async function handleBloqueSubmit(formData: FormData) {
    setPending(true);
    try {
      if (selected) await updateBloque(selected.id, formData);
      else          await createBloque(formData);
      closeModal();
    } finally { setPending(false); }
  }

  async function handleToggle(b: Bloque) {
    await toggleBloque(b.id, !b.activo);
  }

  async function handleDelete(b: Bloque) {
    if (!confirm(`¿Eliminar "${b.nombre}"? Esta acción también eliminará sus plantas y espacios.`)) return;
    await deleteBloque(b.id);
  }

  async function handlePlantaSubmit(formData: FormData) {
    setPending(true);
    try {
      if (selectedPlanta) await updatePlanta(selectedPlanta.id, formData);
      else if (selected)  await createPlanta(selected.id, formData);
      setPlantaMode(null);
      setSelectedPlanta(null);
    } finally { setPending(false); }
  }

  async function handleDeletePlanta(p: Planta) {
    if (!confirm(`¿Eliminar la planta "${p.nombre}"?`)) return;
    await deletePlanta(p.id);
    setPlantaMode(null);
    setSelectedPlanta(null);
  }

  return (
    <>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <section className="surface-card scroll-reveal">
        <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Bloque de acciones</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Gestión del CRUD</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Crea, edita, activa/desactiva y elimina bloques. Gestiona sus plantas desde el botón de planos.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(43,108,176,0.34)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <Icon name="plus" />
            Nuevo bloque
          </button>
        </div>
      </section>

      {/* ── Tabla ───────────────────────────────────────────────────────── */}
      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--divider)] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Listado</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Bloques registrados</h2>
          </div>
          <span className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">{bloques.length} en total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-[var(--secondary)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <tr>
                <th className="px-5 py-3 font-semibold">Bloque</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Plantas</th>
                <th className="px-5 py-3 font-semibold">Espacios</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bloques.map((b) => (
                <tr key={b.id} className="border-t border-[var(--divider)] transition hover:bg-[var(--primary-light)]/40">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[var(--text)]">{b.nombre}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">{b.resumen}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-[var(--text-secondary)]">{b.slug}</span>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{b.plantas.length}</td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{b._count.espacios}</td>
                  <td className="px-5 py-4">
                    <span className={`badge-pill ${b.activo ? "bg-green-100 text-green-700" : "bg-[var(--secondary)] text-[var(--text-muted)]"}`}>
                      {b.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openPlantas(b)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-soft)] px-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                        title="Gestionar plantas">
                        <Icon name="home" className="h-3.5 w-3.5" />Plantas
                      </button>
                      <button type="button" onClick={() => openEdit(b)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-soft)] px-3 text-sm font-semibold text-[var(--primary)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
                        <Icon name="edit" className="h-3.5 w-3.5" />Editar
                      </button>
                      <button type="button" onClick={() => handleToggle(b)}
                        className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          b.activo
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50 focus:ring-amber-400"
                            : "border-green-200 text-green-700 hover:bg-green-50 focus:ring-green-400"
                        }`}>
                        <Icon name={b.activo ? "toggleOn" : "toggleOff"} className="h-3.5 w-3.5" />
                        {b.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button type="button" onClick={() => handleDelete(b)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--danger)]/25 px-3 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-light)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] focus:ring-offset-2">
                        <Icon name="trash" className="h-3.5 w-3.5" />Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modal crear / editar bloque ──────────────────────────────────── */}
      <AdminFormModal
        open={modalMode === "create" || modalMode === "edit"}
        onClose={closeModal}
        title={modalMode === "create" ? "Crear bloque" : `Editar: ${selected?.nombre}`}
        subtitle={modalMode === "create" ? "Nuevo registro" : "Editar registro"}
        iconName={modalMode === "create" ? "plus" : "edit"}
        size="md"
        pending={pending}
        formAction={handleBloqueSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--text)]">Nombre <span className="text-[var(--danger)]">*</span></span>
            <input name="nombre" required defaultValue={selected?.nombre ?? ""} placeholder="Bloque A" className={fieldClass} />
          </label>
          {modalMode === "create" && (
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-[var(--text)]">Slug / ID (URL)</span>
              <input name="slug" defaultValue="" placeholder="a (auto si vacío)" className={fieldClass} />
              <p className="text-xs text-[var(--text-muted)]">Se genera automáticamente si se deja vacío.</p>
            </label>
          )}
          <label className={`space-y-1.5 ${modalMode === "create" ? "" : "sm:col-span-2"}`}>
            <span className="text-sm font-semibold text-[var(--text)]">Orden de visualización</span>
            <input type="number" name="orden" min={0} defaultValue={selected?.orden ?? 0} className={fieldClass} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--text)]">Resumen corto <span className="text-[var(--danger)]">*</span></span>
            <input name="resumen" required defaultValue={selected?.resumen ?? ""} placeholder="Una línea descriptiva" className={fieldClass} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--text)]">Descripción completa <span className="text-[var(--danger)]">*</span></span>
            <textarea name="descripcion" required rows={4} defaultValue={selected?.descripcion ?? ""} placeholder="Descripción detallada del bloque..." className={areaClass} />
          </label>

          {/* Sección de imágenes */}
          <div className="sm:col-span-2 border-t border-[var(--divider)] pt-4">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--secondary)] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                  <Icon name="file" className="h-4 w-4 text-[var(--primary)]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">Imágenes del registro</p>
                  {selected ? (
                    <p className="text-xs text-[var(--text-muted)]">Planos, fotos y referencias del bloque.</p>
                  ) : (
                    <p className="text-xs text-amber-600">Guarda primero el registro para poder agregar imágenes.</p>
                  )}
                </div>
              </div>
              {selected && (
                <Link
                  href={`/admin/bloques/${selected.id}/imagenes`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--primary)]/30 bg-white px-3 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
                >
                  <Icon name="file" className="h-3.5 w-3.5" />
                  Administrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </AdminFormModal>

      {/* ── Modal plantas ────────────────────────────────────────────────── */}
      {modalMode === "plantas" && selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/50 backdrop-blur-sm sm:items-center sm:p-6">
          <section
            role="dialog" aria-modal="true"
            className="flex w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-[var(--border-soft)] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)] sm:rounded-2xl"
            style={{ maxHeight: "calc(100vh - 48px)" }}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--divider)] bg-[var(--primary-light)]/60 px-6 py-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(43,108,176,0.3)]">
                  <Icon name="home" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Planos / Plantas</p>
                  <h3 className="mt-0.5 text-xl font-semibold text-[var(--text)]">Plantas de {selected.nombre}</h3>
                </div>
              </div>
              <button type="button" onClick={closeModal}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Lista de plantas */}
              <div className="border-b border-[var(--divider)]">
                {selected.plantas.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-[var(--text-muted)]">Sin plantas registradas.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--secondary)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold">Nombre</th>
                        <th className="px-5 py-3 text-left font-semibold">Nivel</th>
                        <th className="px-5 py-3 text-left font-semibold">Imagen</th>
                        <th className="px-5 py-3 text-right font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.plantas.map((p) => (
                        <tr key={p.id} className="border-t border-[var(--divider)]">
                          <td className="px-5 py-3 font-medium text-[var(--text)]">{p.nombre}</td>
                          <td className="px-5 py-3 text-[var(--text-secondary)]">{p.nivel}</td>
                          <td className="px-5 py-3">
                            <span className="font-mono text-xs text-[var(--text-muted)] line-clamp-1">{p.imagenUrl}</span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => { setSelectedPlanta(p); setPlantaMode("edit"); }}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--border-soft)] px-2.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                                <Icon name="edit" className="h-3 w-3" />Editar
                              </button>
                              <button type="button" onClick={() => handleDeletePlanta(p)}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--danger)]/25 px-2.5 text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-light)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)]">
                                <Icon name="trash" className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Formulario crear/editar planta */}
              {plantaMode ? (
                <form action={handlePlantaSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
                  <h4 className="col-span-2 text-base font-semibold text-[var(--text)]">
                    {plantaMode === "create" ? "Nueva planta" : `Editar: ${selectedPlanta?.nombre}`}
                  </h4>
                  <label className="space-y-1.5">
                    <span className="text-sm font-semibold text-[var(--text)]">Nombre <span className="text-[var(--danger)]">*</span></span>
                    <input name="nombre" required defaultValue={selectedPlanta?.nombre ?? ""} placeholder="Planta Baja" className={fieldClass} />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-semibold text-[var(--text)]">Nivel (orden)</span>
                    <input type="number" name="nivel" min={0} defaultValue={selectedPlanta?.nivel ?? 0} className={fieldClass} />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--text)]">URL de imagen / plano <span className="text-[var(--danger)]">*</span></span>
                    <input name="imagenUrl" required defaultValue={selectedPlanta?.imagenUrl ?? ""} placeholder="/planos/bloque-a-b-c-planta-baja.svg" className={fieldClass} />
                  </label>
                  <div className="col-span-2 flex gap-3">
                    <button type="button" onClick={() => { setPlantaMode(null); setSelectedPlanta(null); }}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-white px-4 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--secondary)] focus:outline-none">
                      Cancelar
                    </button>
                    <button type="submit" disabled={pending}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-4 text-sm font-semibold text-white disabled:opacity-70 focus:outline-none">
                      <Icon name="checkCircle" className="h-4 w-4" />
                      {pending ? "Guardando..." : "Guardar planta"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <button type="button" onClick={() => { setSelectedPlanta(null); setPlantaMode("create"); }}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--primary)]/30 px-4 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                    <Icon name="plus" />
                    Agregar planta
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
