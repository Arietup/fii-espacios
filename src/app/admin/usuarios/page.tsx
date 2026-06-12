import Icon from "@/components/Icon";
import UsuariosCrudClient from "./UsuariosCrudClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Administrar usuarios | Espacios FII",
};

export default async function UsuariosPage() {
  const session = await auth();
  const usuarios = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card scroll-reveal p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
              <Icon name="shield" className="h-3.5 w-3.5" />
              Administracion
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">Administrar usuarios</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
              Crea, edita y elimina cuentas mediante ventanas emergentes. Las acciones estan disponibles solo para administradores.
            </p>
          </div>
          <div className="kpi-card p-4">
            <p className="relative text-sm text-[var(--text-secondary)]">Usuarios registrados</p>
            <p className="relative mt-1 text-3xl font-semibold text-[var(--primary)]">{usuarios.length}</p>
          </div>
        </div>
      </section>

      <UsuariosCrudClient
        currentUserId={session?.user.id}
        usuarios={usuarios.map((usuario) => ({
          id: usuario.id,
          username: usuario.username,
          name: usuario.name,
          role: usuario.role,
          createdAt: usuario.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
