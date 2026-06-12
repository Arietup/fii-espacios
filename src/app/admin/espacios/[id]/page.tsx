import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import { fetchEspacioAdmin } from "@/lib/espacios";

export const dynamic = "force-dynamic";

function Value({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border-soft)] bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text)]">{value || "No definido"}</p>
    </div>
  );
}

export default async function AdminEspacioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const espacio = await fetchEspacioAdmin(id);
  if (!espacio) notFound();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader
        title={espacio.nombre}
        description="Detalle administrativo completo del espacio fisico."
        backHref="/admin/espacios"
        backLabel="Espacios"
        actions={
          <Link href={`/admin/espacios/${espacio.id}/editar`} className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Icon name="edit" className="h-4 w-4" />Editar
          </Link>
        }
      />
      <section className="surface-card p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Value label="Codigo" value={espacio.codigo} />
          <Value label="Bloque" value={espacio.bloque.nombre} />
          <Value label="Planta" value={espacio.planta.nombre} />
          <Value label="Tipo" value={espacio.tipo.etiqueta} />
          <Value label="Estado fisico" value={espacio.estadoFisico?.nombre} />
          <Value label="Acceso" value={espacio.accesoPublico ? "Publico" : "Restringido"} />
          <Value label="Capacidad" value={espacio.capacidad ? `${espacio.capacidad} personas` : null} />
          <Value label="Puestos" value={espacio.cantidadPuestos} />
          <Value label="Area" value={espacio.areaM2 ? `${espacio.areaM2} m2` : null} />
          <Value label="Medidas" value={[espacio.largoCm, espacio.anchoCm, espacio.altoCm].some(Boolean) ? `${espacio.largoCm ?? "-"} x ${espacio.anchoCm ?? "-"} x ${espacio.altoCm ?? "-"} cm` : null} />
          <Value label="Activo" value={espacio.activo ? "Si" : "No"} />
          <Value label="URL publica" value={<Link className="text-[var(--primary)] hover:underline" href={`/espacios/${espacio.slug}`}>/espacios/{espacio.slug}</Link>} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">Descripcion</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{espacio.descripcion}</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">Observaciones</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{espacio.observaciones ?? "Sin observaciones"}</p>
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="text-base font-semibold text-[var(--text)]">Usos asociados</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {espacio.usos.length > 0 ? espacio.usos.map((uso) => (
              <span key={uso.usoId} className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">{uso.uso.nombre}</span>
            )) : <p className="text-sm text-[var(--text-muted)]">Sin usos registrados.</p>}
          </div>
        </div>
        <div className="surface-card p-6">
          <h2 className="text-base font-semibold text-[var(--text)]">Equipamiento</h2>
          <div className="mt-3 grid gap-2">
            {espacio.equipamiento.length > 0 ? espacio.equipamiento.map((item) => (
              <div key={item.id} className="rounded-lg bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text)]">{item.equipamiento.nombre}</span> x {item.cantidad}
                {item.estado && <span className="ml-2 text-xs text-[var(--text-muted)]">{item.estado}</span>}
              </div>
            )) : <p className="text-sm text-[var(--text-muted)]">Sin equipamiento registrado.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
