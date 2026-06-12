"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/Icon";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, string> = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

/* Selector de elementos enfocables dentro del modal */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  iconName?: React.ComponentProps<typeof Icon>["name"];
  size?: Size;
  pending?: boolean;
  formAction: (data: FormData) => void | Promise<void>;
  submitLabel?: string;
  children: React.ReactNode;
};

export default function AdminFormModal({
  open,
  onClose,
  title,
  subtitle,
  iconName,
  size = "md",
  pending = false,
  formAction,
  submitLabel = "Guardar",
  children,
}: Props) {
  /* ── Montaje en cliente (evitar hydration mismatch con Portal) ──── */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const dialogRef    = useRef<HTMLElement>(null);
  const prevFocusRef = useRef<Element | null>(null);
  const titleId      = useId();
  const subtitleId   = useId();

  /* ── Scroll lock + foco automático + restaurar foco al cerrar ───── */
  useEffect(() => {
    if (!open) return;

    prevFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      (prevFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  /* ── Focus trap: Tab / Shift+Tab + Escape ────────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  /* ── No renderizar nada hasta estar montado en cliente ─────────── */
  if (!mounted || !open) return null;

  /* ── Portal → document.body (evita que transforms/backdrop-filter
        de ancestros rompan el z-index y el fixed positioning) ─────── */
  return createPortal(
    <>
      {/* Anuncio para lectores de pantalla */}
      <div role="status" aria-live="polite" className="sr-only">
        Diálogo abierto: {title}
      </div>

      {/* ── Overlay de pantalla completa ──────────────────────────────── */}
      <div
        role="presentation"
        style={{ position: "fixed", inset: 0, zIndex: 9999 }}
        className="flex items-end justify-center bg-neutral-950/50 backdrop-blur-sm sm:items-center sm:p-6 animate-fade-in"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* ── Panel del dialog ────────────────────────────────────────── */}
        <section
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={subtitle ? subtitleId : undefined}
          onKeyDown={handleKeyDown}
          className={`flex w-full flex-col overflow-hidden rounded-t-2xl border border-[var(--border-soft)] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.32)] sm:rounded-2xl animate-slide-up ${SIZE_MAP[size]}`}
          style={{ maxHeight: "calc(100dvh - 48px)" }}
        >
          {/* ── Header fijo ─────────────────────────────────────────── */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--divider)] bg-gradient-to-r from-[var(--primary-light)] to-[#eef6ff] px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              {iconName && (
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2B6CB0] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(43,108,176,0.3)]"
                >
                  <Icon name={iconName} className="h-5 w-5" />
                </span>
              )}
              <div>
                {subtitle && (
                  <p
                    id={subtitleId}
                    className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]"
                  >
                    {subtitle}
                  </p>
                )}
                <h3
                  id={titleId}
                  className="mt-0.5 text-xl font-semibold text-[var(--text)]"
                >
                  {title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={`Cerrar diálogo: ${title}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-white text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <Icon name="close" className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* ── Formulario: cuerpo scrollable + footer fijo ──────────── */}
          <form action={formAction} className="flex min-h-0 flex-1 flex-col" noValidate>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
              {children}
            </div>

            {/* Footer fijo */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-[var(--divider)] bg-[var(--secondary)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-white px-5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={pending}
                aria-busy={pending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2B6CB0] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(43,108,176,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(43,108,176,0.34)] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                <Icon name="checkCircle" className="h-4 w-4" aria-hidden="true" />
                {pending ? "Guardando…" : submitLabel}
              </button>
            </div>
          </form>

          {pending && (
            <div role="status" aria-live="polite" className="sr-only">
              Guardando cambios, por favor espera.
            </div>
          )}
        </section>
      </div>
    </>,
    document.body,
  );
}
