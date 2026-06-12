import Link from "next/link";
import Icon from "@/components/Icon";
import { fetchAdminKpis } from "@/lib/espacios";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard administrativo | Espacios FII" };

const SECTIONS = [
  { href: "/admin/bloques",      icon: "building"   as const, label: "Bloques",        desc: "Gestionar edificios" },
  { href: "/admin/plantas",      icon: "layers"     as const, label: "Plantas",         desc: "Gestionar niveles" },
  { href: "/admin/espacios",     icon: "archive"    as const, label: "Espacios",        desc: "Gestionar espacios" },
  { href: "/admin/tipos",        icon: "tag"        as const, label: "Tipos",           desc: "Tipos de espacio" },
  { href: "/admin/usos",         icon: "bookmark"   as const, label: "Usos",            desc: "Usos de espacio" },
  { href: "/admin/equipamientos",icon: "package"    as const, label: "Equipamientos",   desc: "Catálogo de equipos" },
  { href: "/admin/estados",      icon: "zap"        as const, label: "Estados físicos", desc: "Estados de conservación" },
  { href: "/admin/imagenes",     icon: "file"       as const, label: "Imagenes",         desc: "Planos y fotos Base64" },
  { href: "/admin/usuarios",     icon: "users"      as const, label: "Usuarios",        desc: "Cuentas y permisos" },
];

export default async function AdminDashboardPage() {
  const kpis = await fetchAdminKpis();

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal p-6 sm:p-7">
        <p className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
          <Icon name="shield" className="h-3.5 w-3.5" />
          Panel administrativo
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Resumen general del sistema de gestión de espacios de la Facultad de Ingeniería Industrial.
        </p>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[
          { label: "Bloques",       value: kpis.bloques,       sub: `${kpis.bloquesActivos} activos`,       color: "text-[var(--primary)]" },
          { label: "Plantas",       value: kpis.plantas,       sub: "niveles totales",                      color: "text-[var(--primary)]" },
          { label: "Espacios",      value: kpis.espacios,      sub: `${kpis.espaciosActivos} activos`,      color: "text-green-600" },
          { label: "Inactivos",     value: kpis.espacios - kpis.espaciosActivos, sub: "espacios inactivos", color: "text-[var(--text-muted)]" },
          { label: "Tipos",         value: kpis.tipos,         sub: "tipos de espacio",                     color: "text-violet-600" },
          { label: "Usos",          value: kpis.usos,          sub: "usos catalogados",                     color: "text-sky-600" },
          { label: "Equipamientos", value: kpis.equipamientos, sub: "ítems de equipamiento",                color: "text-amber-600" },
          { label: "Estados",       value: kpis.estados,       sub: "estados físicos",                      color: "text-rose-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card p-5">
            <p className="relative text-xs text-[var(--text-secondary)]">{kpi.label}</p>
            <p className={`relative mt-1 text-3xl font-semibold ${kpi.color}`}>{kpi.value}</p>
            <p className="relative mt-1 text-xs text-[var(--text-muted)]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Acceso rápido */}
      <section className="surface-card p-6">
        <h2 className="mb-4 text-base font-semibold text-[var(--text)]">Acceso rápido</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col items-start gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--secondary)] p-4 transition hover:border-[var(--primary)] hover:bg-[var(--primary-light)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--primary)] shadow-sm group-hover:bg-[var(--primary)] group-hover:text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{s.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
