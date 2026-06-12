import Icon from "@/components/Icon";
import EspaciosCrudClient from "./EspaciosCrudClient";
import { fetchEspaciosAdmin, fetchBloqueConPlantas, fetchTipos } from "@/lib/espacios";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrar espacios | Espacios FII",
};

export default async function AdminEspaciosPage() {
  const [espacios, bloques, tipos] = await Promise.all([
    fetchEspaciosAdmin(),
    fetchBloqueConPlantas(),
    fetchTipos(),
  ]);

  const activos   = espacios.filter((e) => e.activo).length;
  const inactivos = espacios.length - activos;

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
              <Icon name="shield" className="h-3.5 w-3.5" />
              Administracion
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">Administrar espacios</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
              Gestiona todos los espacios de la facultad: crea, edita, activa/desactiva y elimina. Filtra por bloque o tipo para encontrar rapidamente lo que buscas.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="kpi-card p-4">
              <p className="relative text-xs text-[var(--text-secondary)]">Total</p>
              <p className="relative mt-1 text-2xl font-semibold text-[var(--primary)]">{espacios.length}</p>
            </div>
            <div className="kpi-card p-4">
              <p className="relative text-xs text-[var(--text-secondary)]">Activos</p>
              <p className="relative mt-1 text-2xl font-semibold text-green-600">{activos}</p>
            </div>
            <div className="kpi-card p-4">
              <p className="relative text-xs text-[var(--text-secondary)]">Inactivos</p>
              <p className="relative mt-1 text-2xl font-semibold text-[var(--text-muted)]">{inactivos}</p>
            </div>
          </div>
        </div>
      </section>

      <EspaciosCrudClient
        espacios={espacios.map((e) => ({
          id:          e.id,
          slug:        e.slug,
          codigo:      e.codigo,
          nombre:      e.nombre,
          descripcion: e.descripcion,
          capacidad:   e.capacidad,
          activo:      e.activo,
          tipoId:      e.tipoId,
          tipo:        { id: e.tipo.id, etiqueta: e.tipo.etiqueta },
          bloqueId:    e.bloqueId,
          bloque:      { id: e.bloque.id, slug: e.bloque.slug, nombre: e.bloque.nombre },
          planta:      { id: e.planta.id, nombre: e.planta.nombre },
        }))}
        bloques={bloques.map((b) => ({
          id:     b.id,
          slug:   b.slug,
          nombre: b.nombre,
          plantas: b.plantas.map((p) => ({ id: p.id, nombre: p.nombre, nivel: p.nivel })),
        }))}
        tipos={tipos.map((t) => ({ id: t.id, etiqueta: t.etiqueta }))}
      />
    </div>
  );
}
