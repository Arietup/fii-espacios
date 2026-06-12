"use client";

export default function DeleteButton({
  formAction,
  label,
}: {
  formAction: (formData: FormData) => Promise<void>;
  label?: string;
}) {
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar ${label ? `"${label}"` : "este elemento"}? Esta acción no se puede deshacer.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
      >
        Eliminar
      </button>
    </form>
  );
}
