"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";
import AdminFormModal from "@/app/admin/_components/AdminFormModal";
import {
  createPlantaInline,
  updatePlantaInline,
  togglePlanta,
  deletePlanta,
} from "./actions";

type BloqueSimple = { id: string; nombre: string };
type Planta = {
  id: string;
  nombre: string;
  codigo: string | null;
  nivel: number;
  orden: number;
  activo: boolean;
  bloqueId: string;
  bloque: { id: string; nombre: string; slug: string };
  imagenUrl: string;
  descripcion: string | null;
  observaciones: string | null;
  _count: { espacios: number };
};

const fieldClass = "fi";
const areaClass = "fi-area";

export default function PlantasCrudClient({
  plantas,
  bloques,
}: {
  plantas: Planta[];
  bloques: BloqueSimple[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected]   = useState<Planta | null>(null);
  const [pending, setPending]     = useState(false);

  function openCreate() { setSelected(null); setModalOpen(true); }
  function openEdit(p: Planta) { setSelected(p); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setSelected(null); }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      if (selected) await updatePlantaInline(selected.id, formData);
      else          await createPlantaInline(formData);
      closeModal();
    } finally { setPending(false); }
  }

  async function handleToggle(p: Planta) {
    await togglePlanta(p.id, !p.activo);
  }

  async function handleDelete(p: Planta) {
    if (!confirm(`¿Eliminar "${p.nombre}"? Si tiene espacios asociados, quedará inactiva.`)) return;
    await deletePlanta(p.id);
  }

  return (
    <>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <section className="surface-card scroll-reveal">
        <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Bloque de acciones</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Gestión del CRUD</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Crea, edita, activa/desactiva y elimina plantas. Cada planta pertenece a un bloque.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(43,108,176,0.34)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <Icon name="plus" />
            Nueva planta
          </button>
        </div>
      </section>

      {/* ── Tabla ───────────────────────────────────────────────────────── */}
      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--divider)] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Listado</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Plantas registradas</h2>
          </div>
          <span className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">{plantas.length} en total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-[var(--secondary)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <tr>
                <th className="px-5 py-3 font-semibold">Planta</th>
                <th className="px-5 py-3 font-semibold">Bloque</th>
                <th className="px-5 py-3 font-semibold">Nivel</th>
                <th className="px-5 py-3 font-semibold">Espacios</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plantas.map((p) => (
                <tr key={p.id} className="border-t border-[var(--divider)] transition hover:bg-[var(--primary-light)]/40">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[var(--text)]">{p.nombre}</p>
                    <p className="mt-0.5 font-mono text-xs text-[var(--text-muted)]">{p.codigo ?? p.imagenUrl}</p>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{p.bloque.nombre}</td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{p.nivel}</td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{p._count.espacios}</td>
                  <td className="px-5 py-4">
                    <span className={`badge-pill ${p.activo ? "bg-green-100 text-green-700" : "bg-[var(--secondary)] text-[var(--text-muted)]"}`}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEdit(p)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-soft)] px-3 text-sm font-semibold text-[var(--primary)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
                        <Icon name="edit" className="h-3.5 w-3.5" />Editar
                      </button>
                      <button type="button" onClick={() => handleToggle(p)}
                        className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          p.activo
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50 focus:ring-amber-400"
                            : "border-green-200 text-green-700 hover:bg-green-50 focus:ring-green-400"
                        }`}>
                        <Icon name={p.activo ? "toggleOn" : "toggleOff"} className="h-3.5 w-3.5" />
                        {p.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button type="button" onClick={() => handleDelete(p)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--danger)]/25 px-3 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-light)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] focus:ring-offset-2">
                        <Icon name="trash" className="h-3.5 w-3.5" />Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plantas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-[var(--text-muted)]">
                    No hay plantas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modal crear / editar planta ──────────────────────────────────── */}
      <AdminFormModal
        open={modalOpen}
        onClose={closeModal}
        title={selected ? `Editar: ${selected.nombre}` : "Nueva planta"}
        subtitle={selected ? "Editar registro" : "Nuevo registro"}
        iconName={selected ? "edit" : "plus"}
        size="md"
        pending={pending}
        formAction={handleSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Bloque */}
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-[var(--text)]">Bloque <span className="text-[var(--danger)]">*</span></span>
            <select name="bloqueId" required defaultValue={selected?.bloqueId ?? ""} className="fi fi-select">
              <option value="">— Selecciona —</option>
              {bloques.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </label>
          {/* Nombre */}
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-[var(--text)]">Nombre <span className="text-[var(--danger)]">*</span></span>
            <input name="nombre" required defaultValue={selected?.nombre ?? ""} placeholder="Planta Baja" className={fieldClass} />
          </label>
          {/* Código */}
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-[var(--text)]">Código</span>
            <input name="codigo" defaultValue={selected?.codigo ?? ""} placeholder="A-PB" className={fieldClass} />
          </label>
          {/* Nivel */}
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-[var(--text)]">Nivel</span>
            <input type="number" name="nivel" min={0} defaultValue={selected?.nivel ?? 0} className={fieldClass} />
          </label>
          {/* Orden */}
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-[var(--text)]">Orden de visualización</span>
            <input type="number" name="orden" min={0} defaultValue={selected?.orden ?? 0} className={fieldClass} />
          </label>
          {/* Estado (solo en edición) */}
          {selected && (
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-[var(--text)]">Estado</span>
              <select name="activo" defaultValue={selected.activo.toString()} className="fi fi-select">
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </label>
          )}
          {/* Imagen / plano URL */}
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--text)]">Imagen / Plano URL <span className="text-[var(--danger)]">*</span></span>
            <input name="imagenUrl" required defaultValue={selected?.imagenUrl ?? ""} placeholder="/planos/bloque-a-pb.svg" className={fieldClass} />
            <p className="text-xs text-[var(--text-muted)]">Ruta al archivo SVG o imagen del plano de planta.</p>
          </label>
          {/* Descripción */}
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--text)]">Descripción</span>
            <textarea name="descripcion" rows={3} defaultValue={selected?.descripcion ?? ""} placeholder="Descripción de la planta..." className={areaClass} />
          </label>
          {/* Observaciones */}
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--text)]">Observaciones</span>
            <textarea name="observaciones" rows={2} defaultValue={selected?.observaciones ?? ""} placeholder="Notas adicionales..." className={areaClass} />
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
                    <p className="text-xs text-[var(--text-muted)]">Planos y referencias de la planta.</p>
                  ) : (
                    <p className="text-xs text-amber-600">Guarda primero el registro para poder agregar imágenes.</p>
                  )}
                </div>
              </div>
              {selected && (
                <Link
                  href={`/admin/plantas/${selected.id}/imagenes`}
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
    </>
  );
}
