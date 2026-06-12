import type { Equipamiento, EstadoFisico, Tipo, UsoEspacio } from "@/generated/prisma/client";

type BloqueOption = {
  id: string;
  nombre: string;
  plantas: { id: string; nombre: string; nivel: number }[];
};

type EspacioFormValue = {
  codigo: string;
  nombre: string;
  slug?: string;
  descripcion: string;
  capacidad: number | null;
  cantidadPuestos: number | null;
  areaM2: number | null;
  largoCm: number | null;
  anchoCm: number | null;
  altoCm: number | null;
  ubicacionReferencia: string | null;
  observaciones: string | null;
  accesoPublico: boolean;
  tipoId: string;
  bloqueId: string;
  plantaId: string;
  estadoFisicoId: string | null;
  usos?: { usoId: string }[];
  equipamiento?: { equipamientoId: string; cantidad: number; estado: string | null; observaciones: string | null }[];
};

const inputClass = "fi";
const selectClass = "fi fi-select";
const areaClass = "fi-area";

export default function EspacioForm({
  action,
  bloques,
  tipos,
  estados,
  usos,
  equipamientos,
  espacio,
}: {
  action: (formData: FormData) => Promise<void>;
  bloques: BloqueOption[];
  tipos: Tipo[];
  estados: EstadoFisico[];
  usos: UsoEspacio[];
  equipamientos: Equipamiento[];
  espacio?: EspacioFormValue;
}) {
  const selectedUsos = new Set(espacio?.usos?.map((uso) => uso.usoId) ?? []);
  const selectedEquipamientos = new Map(
    espacio?.equipamiento?.map((item) => [item.equipamientoId, item]) ?? [],
  );

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Codigo *</span>
        <input name="codigo" required defaultValue={espacio?.codigo ?? ""} className={inputClass} />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Nombre *</span>
        <input name="nombre" required defaultValue={espacio?.nombre ?? ""} className={inputClass} />
      </label>
      {!espacio && (
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-[var(--text)]">Slug opcional</span>
          <input name="slug" className={inputClass} />
        </label>
      )}
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Tipo *</span>
        <select name="tipoId" required defaultValue={espacio?.tipoId ?? ""} className={selectClass}>
          <option value="">Selecciona un tipo</option>
          {tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.etiqueta}</option>)}
        </select>
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Estado fisico</span>
        <select name="estadoFisicoId" defaultValue={espacio?.estadoFisicoId ?? ""} className={selectClass}>
          <option value="">Sin estado</option>
          {estados.map((estado) => <option key={estado.id} value={estado.id}>{estado.nombre}</option>)}
        </select>
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Bloque *</span>
        <select name="bloqueId" required defaultValue={espacio?.bloqueId ?? ""} className={selectClass}>
          <option value="">Selecciona un bloque</option>
          {bloques.map((bloque) => <option key={bloque.id} value={bloque.id}>{bloque.nombre}</option>)}
        </select>
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Planta *</span>
        <select name="plantaId" required defaultValue={espacio?.plantaId ?? ""} className={selectClass}>
          <option value="">Selecciona una planta</option>
          {bloques.map((bloque) => (
            <optgroup key={bloque.id} label={bloque.nombre}>
              {bloque.plantas.map((planta) => <option key={planta.id} value={planta.id}>{planta.nombre}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Capacidad</span>
        <input name="capacidad" type="number" defaultValue={espacio?.capacidad ?? ""} className={inputClass} />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Cantidad de puestos</span>
        <input name="cantidadPuestos" type="number" defaultValue={espacio?.cantidadPuestos ?? ""} className={inputClass} />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Area m2</span>
        <input name="areaM2" type="number" step="0.01" defaultValue={espacio?.areaM2 ?? ""} className={inputClass} />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text)]">Acceso</span>
        <select name="accesoPublico" defaultValue={(espacio?.accesoPublico ?? true).toString()} className={selectClass}>
          <option value="true">Publico</option>
          <option value="false">Restringido</option>
        </select>
      </label>
      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Largo cm</span>
          <input name="largoCm" type="number" defaultValue={espacio?.largoCm ?? ""} className={inputClass} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Ancho cm</span>
          <input name="anchoCm" type="number" defaultValue={espacio?.anchoCm ?? ""} className={inputClass} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text)]">Alto cm</span>
          <input name="altoCm" type="number" defaultValue={espacio?.altoCm ?? ""} className={inputClass} />
        </label>
      </div>
      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-medium text-[var(--text)]">Ubicacion de referencia</span>
        <input name="ubicacionReferencia" defaultValue={espacio?.ubicacionReferencia ?? ""} className={inputClass} />
      </label>
      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-medium text-[var(--text)]">Descripcion *</span>
        <textarea name="descripcion" required rows={3} defaultValue={espacio?.descripcion ?? ""} className={areaClass} />
      </label>
      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-medium text-[var(--text)]">Observaciones</span>
        <textarea name="observaciones" rows={2} defaultValue={espacio?.observaciones ?? ""} className={areaClass} />
      </label>
      <fieldset className="sm:col-span-2 rounded-lg border border-[var(--border-soft)] p-4">
        <legend className="px-1 text-sm font-medium text-[var(--text)]">Usos</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {usos.map((uso) => (
            <label key={uso.id} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input name="usoIds" type="checkbox" value={uso.id} defaultChecked={selectedUsos.has(uso.id)} />
              {uso.nombre}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="sm:col-span-2 rounded-lg border border-[var(--border-soft)] p-4">
        <legend className="px-1 text-sm font-medium text-[var(--text)]">Equipamiento</legend>
        <div className="mt-2 grid gap-3">
          {equipamientos.map((item) => {
            const selected = selectedEquipamientos.get(item.id);
            return (
              <div key={item.id} className="grid gap-2 rounded-lg bg-[var(--secondary)] p-3 sm:grid-cols-[1fr_90px_1fr]">
                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <input name="equipamientoIds" type="checkbox" value={item.id} defaultChecked={Boolean(selected)} />
                  {item.nombre}
                </label>
                <input name={`equipamientoCantidad:${item.id}`} type="number" min="1" defaultValue={selected?.cantidad ?? 1} className={inputClass} />
                <input name={`equipamientoEstado:${item.id}`} defaultValue={selected?.estado ?? ""} placeholder="Estado/observacion breve" className={inputClass} />
              </div>
            );
          })}
        </div>
      </fieldset>
      <div className="sm:col-span-2 flex justify-end gap-3">
        <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">Guardar espacio</button>
      </div>
    </form>
  );
}
