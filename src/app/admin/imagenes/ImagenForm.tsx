"use client";

import { useMemo, useState } from "react";

type Entidad = "BLOQUE" | "PLANTA" | "ESPACIO";

type Option = {
  id: string;
  label: string;
};

export default function ImagenForm({
  action,
  bloques,
  plantas,
  espacios,
  presetEntidad,
  presetEntidadId,
  returnTo,
}: {
  action: (formData: FormData) => Promise<void>;
  bloques: Option[];
  plantas: Option[];
  espacios: Option[];
  presetEntidad?: Entidad;
  presetEntidadId?: string;
  returnTo?: string;
}) {
  const [entidad, setEntidad] = useState<Entidad>(presetEntidad ?? "PLANTA");
  const [preview, setPreview] = useState<string | null>(null);
  const options = useMemo(() => {
    if (entidad === "BLOQUE") return bloques;
    if (entidad === "ESPACIO") return espacios;
    return plantas;
  }, [bloques, entidad, espacios, plantas]);

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Entidad *</span>
        <select
          name="entidad"
          value={entidad}
          onChange={(event) => setEntidad(event.target.value as Entidad)}
          disabled={Boolean(presetEntidad)}
          className="fi fi-select"
        >
          <option value="BLOQUE">Bloque</option>
          <option value="PLANTA">Planta</option>
          <option value="ESPACIO">Espacio</option>
        </select>
        {presetEntidad && <input type="hidden" name="entidad" value={presetEntidad} />}
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Registro *</span>
        <select
          name="entidadId"
          required
          defaultValue={presetEntidadId ?? ""}
          disabled={Boolean(presetEntidadId)}
          className="fi fi-select"
        >
          <option value="">Selecciona un registro</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
        {presetEntidadId && <input type="hidden" name="entidadId" value={presetEntidadId} />}
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Tipo *</span>
        <select name="tipo" required className="fi fi-select">
          <option value="PLANO">Plano</option>
          <option value="REFERENCIAL">Referencial</option>
          <option value="FOTO">Foto</option>
          <option value="CROQUIS">Croquis</option>
          <option value="OTRO">Otro</option>
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Orden</span>
        <input name="orden" type="number" defaultValue="0" className="fi" />
      </label>

      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-medium text-[var(--text)]">Archivo *</span>
        <input
          name="imagen"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          required
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              setPreview(null);
              return;
            }
            const reader = new FileReader();
            reader.onload = () => setPreview(String(reader.result));
            reader.readAsDataURL(file);
          }}
          className="fi-file"
        />
        <p className="text-xs text-[var(--text-muted)]">PNG, JPG, WEBP o SVG. Maximo 2 MB.</p>
      </label>

      {preview && (
        <div className="sm:col-span-2 overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--secondary)]">
          <div className="aspect-[16/9]">
            <img src={preview} alt="Vista previa" className="h-full w-full object-contain p-3" />
          </div>
        </div>
      )}

      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-medium text-[var(--text)]">Nombre</span>
        <input name="nombre" className="fi" />
      </label>

      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-medium text-[var(--text)]">Descripcion</span>
        <textarea name="descripcion" rows={3} className="fi-area" />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
        <input name="principal" type="checkbox" />
        Marcar como principal
      </label>

      <div className="sm:col-span-2 flex justify-end">
        <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Guardar imagen</button>
      </div>
    </form>
  );
}
