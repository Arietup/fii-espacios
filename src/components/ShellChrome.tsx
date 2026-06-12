"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "./Icon";

type ShellUser = {
  name?: string | null;
  role?: string | null;
} | null;

const NAV_LINKS = [
  { href: "/",      label: "Inicio",         description: "Resumen general",      icon: "home"      as const },
  { href: "/bloques", label: "Bloques",       description: "Distribución física",  icon: "building"  as const },
  { href: "/espacios", label: "Buscar espacios", description: "Consulta directa", icon: "search"    as const },
  // ─── Admin ────────────────────────────────────────────────────────────────
  { href: "/admin",             label: "Dashboard",       description: "Panel administrativo",  icon: "dashboard"  as const, adminOnly: true },
  { href: "/admin/usuarios",    label: "Usuarios",        description: "Cuentas y permisos",    icon: "users"      as const, adminOnly: true },
  { href: "/admin/bloques",     label: "Bloques",         description: "CRUD de bloques",       icon: "building"   as const, adminOnly: true },
  { href: "/admin/plantas",     label: "Plantas",         description: "CRUD de plantas",       icon: "layers"     as const, adminOnly: true },
  { href: "/admin/espacios",    label: "Espacios",        description: "CRUD de espacios",      icon: "archive"    as const, adminOnly: true },
  { href: "/admin/tipos",       label: "Tipos",           description: "Tipos de espacio",      icon: "tag"        as const, adminOnly: true },
  { href: "/admin/usos",        label: "Usos",            description: "Usos de espacio",       icon: "bookmark"   as const, adminOnly: true },
  { href: "/admin/equipamientos", label: "Equipamientos", description: "Catálogo de equipos",  icon: "package"    as const, adminOnly: true },
  { href: "/admin/estados",     label: "Estados",         description: "Estados físicos",       icon: "zap"        as const, adminOnly: true },
];

function getContextLabel(pathname: string) {
  if (pathname.startsWith("/admin/bloques"))      return "Admin — Bloques";
  if (pathname.startsWith("/admin/plantas"))       return "Admin — Plantas";
  if (pathname.startsWith("/admin/espacios"))      return "Admin — Espacios";
  if (pathname.startsWith("/admin/tipos"))         return "Admin — Tipos";
  if (pathname.startsWith("/admin/usos"))          return "Admin — Usos";
  if (pathname.startsWith("/admin/equipamientos")) return "Admin — Equipamientos";
  if (pathname.startsWith("/admin/estados"))       return "Admin — Estados";
  if (pathname.startsWith("/admin/usuarios"))      return "Admin — Usuarios";
  if (pathname.startsWith("/admin"))               return "Administración";
  if (pathname.startsWith("/espacios"))            return "Búsqueda de espacios";
  if (pathname.startsWith("/bloques"))             return "Gestión de bloques";
  return "Panel principal";
}

export default function ShellChrome({
  children,
  sessionUser,
  signOutControl,
}: {
  children: React.ReactNode;
  sessionUser: ShellUser;
  signOutControl?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/login") {
    return <main className="min-h-screen bg-[var(--app-bg)]">{children}</main>;
  }

  const links = NAV_LINKS.filter((link) => !link.adminOnly || sessionUser?.role === "ADMIN");

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text)]">
      <div
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--border-soft)] bg-white shadow-[0_18px_60px_rgba(43,108,176,0.06)] transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-24" : "w-72"
        }`}
      >
        <aside className="flex h-full flex-col">
          <div className="flex h-24 items-center justify-center gap-3 border-b border-[var(--divider)] px-5">
            {!collapsed && (
              <>
                <div className="brand-logo-badge h-12 w-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/LogoUGcolor.svg?v=5"
                    alt="Universidad de Guayaquil"
                    className="brand-logo-img"
                  />
                </div>
              <div className="min-w-0">
                <Link href="/" className="block truncate text-base font-semibold text-[var(--text)]">
                  Espacios FII
                </Link>
                <p className="truncate text-xs text-[var(--text-muted)]">Facultad de Ing. Industrial</p>
              </div>
              </>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-white text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
              title={collapsed ? "Expandir menu" : "Colapsar menu"}
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Navegacion principal" className="nav nav-pills bs5-sidebar flex-column flex-1 px-3 py-5">
            {links.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className={`nav-link bs5-nav-link group flex items-center gap-3 text-sm no-underline ${
                    active
                      ? "active bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_10px_30px_rgba(43,108,176,0.28)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      active ? "bg-white/20" : "bg-[var(--secondary)] group-hover:bg-white"
                    }`}
                  >
                    <Icon name={link.icon} className="h-5 w-5 shrink-0" />
                  </span>
                  {!collapsed && (
                    <span className="min-w-0">
                      <span className="block font-medium">{link.label}</span>
                      <span className={`block text-xs ${active ? "text-white/75" : "text-[var(--text-muted)]"}`}>
                        {link.description}
                      </span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menu"
          className="fixed inset-0 z-40 bg-neutral-950/35 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[88vw] border-r border-[var(--border-soft)] bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center gap-3 border-b border-[var(--divider)] px-5">
          <span className="brand-logo-badge h-12 w-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LogoUGcolor.svg?v=5"
              alt="Universidad de Guayaquil"
              className="brand-logo-img"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[var(--text)]">Espacios FII</p>
            <p className="truncate text-xs text-[var(--text-muted)]">Facultad de Ing. Industrial</p>
          </div>
        </div>
        <nav className="nav nav-pills bs5-sidebar flex-column px-4 py-5" aria-label="Navegacion movil">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link bs5-nav-link flex items-center gap-3 text-sm no-underline ${
                  active
                    ? "active bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_10px_30px_rgba(43,108,176,0.28)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                }`}
              >
                <Icon name={link.icon} className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-white/85 backdrop-blur-md">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 lg:hidden"
                aria-label="Abrir menu"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  <span>Espacios FII</span>
                  <Icon name="chevronRight" className="h-3.5 w-3.5" />
                  <span className="truncate text-[var(--primary)]">{getContextLabel(pathname)}</span>
                </p>
                <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                  Facultad de Ingenieria Industrial - Universidad de Guayaquil
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="relative hidden h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 sm:inline-flex"
                aria-label="Notificaciones"
                title="Notificaciones"
              >
                <Icon name="bell" className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger)] ring-2 ring-white" />
              </button>
              {sessionUser && (
                <div className="flex items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white px-2.5 py-2 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2B6CB0] to-[#3B82F6] text-white">
                    <Icon name="user" />
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="max-w-36 truncate text-sm font-semibold text-[var(--text)]">
                      {sessionUser.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {sessionUser.role === "ADMIN" ? "Administrador" : "Usuario"}
                    </p>
                  </div>
                  {signOutControl}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-content-shell mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <footer className="border-t border-[var(--border-soft)] bg-white px-4 py-5 text-xs text-[var(--text-muted)] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            Guia orientativa de espacios de la Facultad de Ingenieria Industrial de la Universidad de Guayaquil.
          </div>
        </footer>
      </div>
    </div>
  );
}
