import Link from "next/link";
import Icon from "@/components/Icon";

type AdminModalProps = {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
};

const SIZE_CLASS: Record<NonNullable<AdminModalProps["size"]>, string> = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export default function AdminModal({
  title,
  description,
  backHref,
  backLabel = "Cerrar",
  children,
  size = "lg",
}: AdminModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[var(--text)]/45 px-4 py-6 backdrop-blur-sm sm:items-center">
      <section
        aria-modal="true"
        role="dialog"
        aria-label={title}
        className={`w-full ${SIZE_CLASS[size]} overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl`}
        style={{ maxHeight: "92vh" }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border-soft)] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <Link href={backHref} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
              <Icon name="arrowLeft" className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
            <h1 className="mt-2 text-xl font-bold text-[var(--text)] sm:text-2xl">{title}</h1>
            {description ? <p className="mt-1 text-sm text-[var(--muted)]">{description}</p> : null}
          </div>
          <Link
            href={backHref}
            aria-label="Cerrar ventana"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-soft)] text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <Icon name="close" className="h-4 w-4" />
          </Link>
        </header>
        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6" style={{ maxHeight: "calc(92vh - 94px)" }}>
          {children}
        </div>
      </section>
    </div>
  );
}
