import Link from "next/link";
import Icon from "@/components/Icon";

export default function AdminHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="surface-card scroll-reveal p-6 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              {backLabel ?? "Volver"}
            </Link>
          )}
          <p className="badge-pill bg-[var(--primary-light)] text-[var(--primary)]">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Administración
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </section>
  );
}
