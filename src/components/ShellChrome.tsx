"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "./Icon";

type ShellUser = {
  name?: string | null;
  role?: string | null;
} | null;

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  adminOnly?: boolean;
};

type NavGroup = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  adminOnly?: boolean;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    key: "publico",
    label: "Público",
    icon: "home",
    items: [
      { href: "/",        label: "Inicio",           description: "Resumen general",      icon: "home"     },
      { href: "/bloques", label: "Bloques",           description: "Distribución física",  icon: "building" },
      { href: "/espacios",label: "Buscar espacios",   description: "Consulta directa",     icon: "search"   },
    ],
  },
  {
    key: "administracion",
    label: "Administración",
    icon: "shield",
    adminOnly: true,
    items: [
      { href: "/admin",          label: "Dashboard", description: "Panel administrativo", icon: "dashboard", adminOnly: true },
      { href: "/admin/usuarios", label: "Usuarios",  description: "Cuentas y permisos",   icon: "users",     adminOnly: true },
    ],
  },
  {
    key: "inventario",
    label: "Inventario",
    icon: "archive",
    adminOnly: true,
    items: [
      { href: "/admin/bloques",  label: "Bloques",  description: "CRUD de bloques",  icon: "building", adminOnly: true },
      { href: "/admin/plantas",  label: "Plantas",  description: "CRUD de plantas",  icon: "layers",   adminOnly: true },
      { href: "/admin/espacios", label: "Espacios", description: "CRUD de espacios", icon: "archive",  adminOnly: true },
    ],
  },
  {
    key: "catalogos",
    label: "Catálogos",
    icon: "tag",
    adminOnly: true,
    items: [
      { href: "/admin/tipos",         label: "Tipos",         description: "Tipos de espacio",    icon: "tag",      adminOnly: true },
      { href: "/admin/usos",          label: "Usos",          description: "Usos de espacio",     icon: "bookmark", adminOnly: true },
      { href: "/admin/equipamientos", label: "Equipamientos", description: "Catálogo de equipos", icon: "package",  adminOnly: true },
      { href: "/admin/estados",       label: "Estados",       description: "Estados físicos",     icon: "zap",      adminOnly: true },
    ],
  },
  {
    key: "multimedia",
    label: "Multimedia",
    icon: "file",
    adminOnly: true,
    items: [
      { href: "/admin/imagenes", label: "Imágenes", description: "Gestión multimedia", icon: "file", adminOnly: true },
    ],
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function getContextLabel(pathname: string) {
  if (pathname.startsWith("/admin/bloques"))       return "Admin — Bloques";
  if (pathname.startsWith("/admin/plantas"))        return "Admin — Plantas";
  if (pathname.startsWith("/admin/espacios"))       return "Admin — Espacios";
  if (pathname.startsWith("/admin/tipos"))          return "Admin — Tipos";
  if (pathname.startsWith("/admin/usos"))           return "Admin — Usos";
  if (pathname.startsWith("/admin/equipamientos"))  return "Admin — Equipamientos";
  if (pathname.startsWith("/admin/estados"))        return "Admin — Estados";
  if (pathname.startsWith("/admin/usuarios"))       return "Admin — Usuarios";
  if (pathname.startsWith("/admin/imagenes"))       return "Admin — Imágenes";
  if (pathname.startsWith("/admin"))                return "Administración";
  if (pathname.startsWith("/espacios"))             return "Búsqueda de espacios";
  if (pathname.startsWith("/bloques"))              return "Gestión de bloques";
  return "Panel principal";
}

// ─── Sección de grupo (definida fuera del componente para evitar re-mount) ───

function NavGroupSection({
  group,
  isOpen,
  isAdmin,
  pathname,
  onToggle,
  onNavigate,
}: {
  group: NavGroup;
  isOpen: boolean;
  isAdmin: boolean;
  pathname: string;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const hasActive   = group.items.some((item) => isActive(item.href, pathname));
  const visibleItems = group.items.filter((item) => !item.adminOnly || isAdmin);
  const listId      = `nav-group-${group.key}`;

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={listId}
        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold uppercase tracking-[0.13em] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1 ${
          hasActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
        }`}
      >
        <Icon name={group.icon} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">{group.label}</span>
        <Icon
          name="chevronRight"
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      <div
        id={listId}
        role="list"
        hidden={!isOpen}
        className={`ml-2 mt-0.5 space-y-0.5 border-l border-[var(--divider)] pl-2 ${isOpen ? "" : "hidden"}`}
      >
        {visibleItems.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              role="listitem"
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm no-underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1 ${
                active
                  ? "bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_8px_20px_rgba(43,108,176,0.22)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                  active ? "bg-white/20" : "bg-[var(--secondary)]"
                }`}
              >
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium leading-tight">{item.label}</span>
                <span
                  className={`block truncate text-xs leading-tight ${
                    active ? "text-white/70" : "text-[var(--text-muted)]"
                  }`}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

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

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const result: Record<string, boolean> = {};
    for (const group of NAV_GROUPS) {
      // Abrir si el grupo contiene el path activo o es "publico"
      result[group.key] =
        group.key === "publico" ||
        group.items.some((item) => isActive(item.href, pathname));
    }
    return result;
  });

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (pathname === "/login") {
    return <main id="main-content" className="min-h-screen bg-[var(--app-bg)]">{children}</main>;
  }

  const isAdmin = sessionUser?.role === "ADMIN";
  const visibleGroups = NAV_GROUPS.filter((g) => !g.adminOnly || isAdmin);
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text)]">
      {/* Skip-to-content: visible solo con teclado (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      {/* ── Sidebar desktop ──────────────────────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--border-soft)] bg-white shadow-[0_18px_60px_rgba(43,108,176,0.06)] transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <aside className="flex h-full flex-col">
          {/* Logo header — altura fija */}
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expandir menú"
              className="flex h-20 w-full shrink-0 items-center justify-center border-b border-[var(--divider)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary)]"
            >
              <div className="brand-logo-badge h-10 w-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/LogoUGcolor.svg?v=5"
                  alt="Universidad de Guayaquil"
                  className="brand-logo-img"
                />
              </div>
            </button>
          ) : (
            <div className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-[var(--divider)] px-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="brand-logo-badge h-10 w-10 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/LogoUGcolor.svg?v=5"
                    alt="Universidad de Guayaquil"
                    className="brand-logo-img"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href="/"
                    className="block truncate text-sm font-semibold text-[var(--text)] no-underline"
                  >
                    Espacios FII
                  </Link>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    Fac. de Ing. Industrial
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-white text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                aria-label="Colapsar menú"
              >
                <Icon name="menu" className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Navegación — solo visible cuando expandido */}
          {!collapsed && (
            <nav
              aria-label="Navegación principal"
              className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4"
            >
              {visibleGroups.map((group) => (
                <NavGroupSection
                  key={group.key}
                  group={group}
                  isOpen={openGroups[group.key] ?? true}
                  isAdmin={isAdmin}
                  pathname={pathname}
                  onToggle={() => toggleGroup(group.key)}
                />
              ))}
            </nav>
          )}
        </aside>
      </div>

      {/* ── Mobile overlay backdrop ──────────────────────────────────────── */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-neutral-950/35 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar móvil ────────────────────────────────────────────────── */}
      <div
        id="mobile-sidebar"
        role="navigation"
        aria-label="Menú de navegación móvil"
        aria-hidden={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[88vw] flex-col border-r border-[var(--border-soft)] bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo header móvil */}
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-[var(--divider)] px-4">
          <span className="brand-logo-badge h-10 w-10 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LogoUGcolor.svg?v=5"
              alt="Universidad de Guayaquil"
              className="brand-logo-img"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">Espacios FII</p>
            <p className="truncate text-xs text-[var(--text-muted)]">Fac. de Ing. Industrial</p>
          </div>
        </div>

        {/* Navegación móvil con scroll interno */}
        <nav
          aria-label="Navegación móvil"
          className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4"
        >
          {visibleGroups.map((group) => (
            <NavGroupSection
              key={group.key}
              group={group}
              isOpen={openGroups[group.key] ?? true}
              isAdmin={isAdmin}
              pathname={pathname}
              onToggle={() => toggleGroup(group.key)}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </div>

      {/* ── Contenido principal ──────────────────────────────────────────── */}
      <div
        className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}
      >
        {/* Header sticky */}
        <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-white/85 backdrop-blur-md">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileOpen}
                aria-controls="mobile-sidebar"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 lg:hidden"
              >
                <Icon name="menu" className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  <span>Espacios FII</span>
                  <Icon name="chevronRight" className="h-3.5 w-3.5" />
                  <span className="truncate text-[var(--primary)]">
                    {getContextLabel(pathname)}
                  </span>
                </p>
                <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                  Facultad de Ingeniería Industrial — Universidad de Guayaquil
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="relative hidden h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 sm:inline-flex"
                aria-label="Notificaciones"
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

        <main id="main-content" className="app-content-shell mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <footer className="border-t border-[var(--border-soft)] bg-white px-4 py-5 text-xs text-[var(--text-muted)] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            Guía orientativa de espacios de la Facultad de Ingeniería Industrial de la Universidad de Guayaquil.
          </div>
        </footer>
      </div>
    </div>
  );
}
