import { auth, signOut } from "@/lib/auth";
import Icon from "./Icon";
import ShellChrome from "./ShellChrome";

export default async function Header({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <ShellChrome
      sessionUser={
        session?.user
          ? { name: session.user.name, role: session.user.role }
          : null
      }
      signOutControl={
        session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-light)]/50 text-[var(--danger)] transition hover:-translate-y-0.5 hover:bg-[var(--danger)] hover:text-white hover:shadow-[0_12px_28px_rgba(239,68,68,0.32)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] focus:ring-offset-2"
              aria-label="Cerrar sesion"
              title="Cerrar sesion"
            >
              <Icon name="logOut" className="h-[18px] w-[18px] transition group-hover:translate-x-0.5" />
            </button>
          </form>
        ) : null
      }
    >
      {children}
    </ShellChrome>
  );
}
