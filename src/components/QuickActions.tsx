"use client";

import { useState } from "react";
import Icon from "./Icon";

type QuickAction = "print" | "share" | "download";

export default function QuickActions({
  title,
  filename,
  payload,
}: {
  title: string;
  filename: string;
  payload: unknown;
}) {
  const [loading, setLoading] = useState<QuickAction | null>(null);

  function run(action: QuickAction, callback: () => void | Promise<void>) {
    setLoading(action);
    Promise.resolve(callback()).finally(() => {
      window.setTimeout(() => setLoading(null), 350);
    });
  }

  function download() {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  }

  const actions = [
    { key: "share" as const, label: "Compartir", icon: "share" as const, run: share },
    { key: "print" as const, label: "Imprimir", icon: "printer" as const, run: () => window.print() },
    { key: "download" as const, label: "Descargar", icon: "download" as const, run: download },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={() => run(action.key, action.run)}
          disabled={loading !== null}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white px-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-70"
        >
          {loading === action.key ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
          ) : (
            <Icon name={action.icon} />
          )}
          {action.label}
        </button>
      ))}
    </div>
  );
}
