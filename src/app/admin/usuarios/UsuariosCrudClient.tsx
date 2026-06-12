"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { deleteUserFromForm, saveUser } from "./actions";

type Usuario = {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

const fieldClass = "fi";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function UsuariosCrudClient({
  usuarios,
  currentUserId,
}: {
  usuarios: Usuario[];
  currentUserId?: string;
}) {
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const csv = useMemo(() => {
    const header = ["usuario", "nombre", "rol", "creado"];
    const rows = usuarios.map((usuario) => [
      usuario.username,
      usuario.name,
      usuario.role,
      formatDate(usuario.createdAt),
    ]);
    return [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
  }, [usuarios]);

  function openCreate() {
    setSelectedUser(null);
    setShowPassword(false);
    setModalMode("create");
  }

  function openEdit(usuario: Usuario) {
    setSelectedUser(usuario);
    setShowPassword(false);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedUser(null);
  }

  function exportCsv() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "usuarios-espacios-fii.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="surface-card scroll-reveal">
        <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Bloque de acciones
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Gestion del CRUD</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Crea usuarios desde una ventana emergente y administra acciones por registro.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:shadow-[0_16px_36px_rgba(43,108,176,0.34)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <Icon name="users" />
              Nuevo usuario
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white px-5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <Icon name="download" />
              Exportar
            </button>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--divider)] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Listado
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Usuarios registrados</h2>
          </div>
          <span className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
            {usuarios.length} en total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[var(--secondary)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <tr>
                <th className="px-5 py-3 font-semibold">Usuario</th>
                <th className="px-5 py-3 font-semibold">Nombre</th>
                <th className="px-5 py-3 font-semibold">Rol</th>
                <th className="px-5 py-3 font-semibold">Creado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-t border-[var(--divider)] transition hover:bg-[var(--primary-light)]/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#3B82F6] text-xs font-semibold text-white shadow-sm">
                        {initials(usuario.name) || usuario.username.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-secondary)]">{usuario.username}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-[var(--text)]">
                    {usuario.name}
                    {currentUserId === usuario.id && (
                      <span className="ml-2 badge-pill bg-[var(--secondary)] text-[var(--text-muted)]">Tu cuenta</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge-pill ${
                        usuario.role === "ADMIN"
                          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                          : "bg-[var(--secondary)] text-[var(--text-secondary)]"
                      }`}
                    >
                      <Icon name={usuario.role === "ADMIN" ? "shield" : "users"} className="h-3.5 w-3.5" />
                      {usuario.role === "ADMIN" ? "Administrador" : "Usuario"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{formatDate(usuario.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(usuario)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-soft)] px-3 text-sm font-semibold text-[var(--primary)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" />
                        Editar
                      </button>
                      {currentUserId !== usuario.id && (
                        <form action={deleteUserFromForm}>
                          <input type="hidden" name="id" value={usuario.id} />
                          <button
                            type="submit"
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--danger)]/25 px-3 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-light)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] focus:ring-offset-2"
                          >
                            <Icon name="trash" className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--divider)] px-5 py-4 text-xs text-[var(--text-muted)] sm:flex-row sm:px-6">
          <p>
            Mostrando <span className="font-semibold text-[var(--text)]">{usuarios.length}</span> de{" "}
            <span className="font-semibold text-[var(--text)]">{usuarios.length}</span> usuarios
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text-muted)] opacity-50"
            >
              <Icon name="arrowLeft" className="h-3.5 w-3.5" />
            </button>
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--primary)] px-2 text-xs font-semibold text-white">
              1
            </span>
            <button
              type="button"
              disabled
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text-muted)] opacity-50"
            >
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--text)]/45 px-4 py-6 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            className="w-full max-w-xl overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.24)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--divider)] bg-[var(--primary-light)]/60 px-6 py-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(43,108,176,0.3)]">
                  <Icon name={modalMode === "create" ? "users" : "edit"} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                    {modalMode === "create" ? "Nuevo registro" : "Editar registro"}
                  </p>
                  <h3 id="user-modal-title" className="mt-0.5 text-xl font-semibold text-[var(--text)]">
                    {modalMode === "create" ? "Crear usuario" : "Actualizar usuario"}
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    {modalMode === "create"
                      ? "Completa los datos para registrar una nueva cuenta."
                      : `Editando la cuenta de ${selectedUser?.name ?? ""}.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                aria-label="Cerrar"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <form action={saveUser}>
              <input type="hidden" name="id" value={selectedUser?.id ?? ""} />
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
                    <Icon name="users" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    Usuario
                  </span>
                  <input
                    name="username"
                    required
                    defaultValue={selectedUser?.username ?? ""}
                    placeholder="nombre.usuario"
                    className={fieldClass}
                  />
                </label>
                <label className="space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
                    <Icon name="users" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    Nombre completo
                  </span>
                  <input
                    name="name"
                    required
                    defaultValue={selectedUser?.name ?? ""}
                    placeholder="Nombre y apellido"
                    className={fieldClass}
                  />
                </label>
                <label className="space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
                    <Icon name="lock" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    {modalMode === "create" ? "Contrasena" : "Nueva contrasena"}
                  </span>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required={modalMode === "create"}
                      minLength={6}
                      placeholder={modalMode === "edit" ? "Dejar en blanco para no cambiarla" : "Minimo 6 caracteres"}
                      className="fi"
                      style={{ paddingRight: "2.75rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-pressed={showPassword}
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--primary)]"
                    >
                      <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
                    </button>
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
                    <Icon name="shield" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    Rol
                  </span>
                  <select
                    name="role"
                    defaultValue={selectedUser?.role ?? "USER"}
                    className="fi fi-select"
                  >
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-col gap-3 border-t border-[var(--divider)] bg-[var(--secondary)] px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-white px-5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:shadow-[0_16px_36px_rgba(43,108,176,0.34)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                >
                  <Icon name="checkCircle" className="h-4 w-4" />
                  Guardar
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
