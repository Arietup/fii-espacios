import Icon from "@/components/Icon";
import BloquesCrudClient from "./BloquesCrudClient";
import { fetchBloquesAdmin } from "@/lib/espacios";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrar bloques | Espacios FII",
};

export default async function AdminBloquesPage() {
  const bloques = await fetchBloquesAdmin();

  const totalEspacios = bloques.reduce((acc, b) => acc + b._count.espacios, 0);
  const activos       = bloques.filter((b) => b.activo).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
              <Icon name="shield" className="h-3.5 w-3.5" />
              Administracion
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">Administrar bloques</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
              Gestiona los bloques de la facultad: crea, edita, activa/desactiva y elimina. Desde cada bloque puedes administrar sus plantas y planos.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="kpi-card p-4">
              <p className="relative text-xs text-[var(--text-secondary)]">Bloques</p>
              <p className="relative mt-1 text-2xl font-semibold text-[var(--primary)]">{bloques.length}</p>
            </div>
            <div className="kpi-card p-4">
              <p className="relative text-xs text-[var(--text-secondary)]">Activos</p>
              <p className="relative mt-1 text-2xl font-semibold text-green-600">{activos}</p>
            </div>
            <div className="kpi-card p-4">
              <p className="relative text-xs text-[var(--text-secondary)]">Espacios</p>
              <p className="relative mt-1 text-2xl font-semibold text-[var(--primary)]">{totalEspacios}</p>
            </div>
          </div>
        </div>
      </section>

      <BloquesCrudClient bloques={bloques} />
    </div>
  );
}
