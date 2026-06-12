import Link from "next/link";
import { notFound } from "next/navigation";
import AdminModal from "@/app/admin/_components/AdminModal";
import Icon from "@/components/Icon";
import { prisma } from "@/lib/prisma";
import { updateUser } from "../actions";

export const metadata = {
  title: "Editar usuario | Espacios FII",
};

const fieldClass = "fi";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await prisma.user.findUnique({ where: { id } });
  if (!usuario) notFound();

  const updateUserWithId = updateUser.bind(null, usuario.id);

  return (
    <AdminModal
      title="Editar usuario"
      description={`Actualiza los datos de ${usuario.username}. Deja la contrasena en blanco si no quieres cambiarla.`}
      backHref="/admin/usuarios"
      backLabel="Usuarios"
    >
      <div className="mb-5">
        <p className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
          <Icon name="shield" className="h-3.5 w-3.5" />
          Administracion
        </p>
      </div>

      <form action={updateUserWithId} className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[var(--divider)] bg-[var(--primary-light)]/60 px-6 py-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(43,108,176,0.3)]">
            <Icon name="edit" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Editar registro</p>
            <h2 className="mt-0.5 text-lg font-semibold text-[var(--text)]">Datos de la cuenta</h2>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
              <Icon name="users" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              Usuario
            </span>
            <input name="username" defaultValue={usuario.username} required className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
              <Icon name="users" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              Nombre completo
            </span>
            <input name="name" defaultValue={usuario.name} required className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
              <Icon name="lock" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              Nueva contrasena
            </span>
            <input
              name="password"
              type="password"
              minLength={6}
              placeholder="Dejar en blanco para no cambiarla"
              className={fieldClass}
            />
          </label>
          <label className="space-y-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
              <Icon name="shield" className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              Rol
            </span>
            <select name="role" defaultValue={usuario.role} className="fi fi-select">
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
        </div>
        <div className="flex flex-col gap-3 border-t border-[var(--divider)] bg-[var(--secondary)] px-6 py-4 sm:flex-row sm:justify-end">
          <Link
            href="/admin/usuarios"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-white px-5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:shadow-[0_16px_36px_rgba(43,108,176,0.34)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <Icon name="checkCircle" className="h-4 w-4" />
            Guardar cambios
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
