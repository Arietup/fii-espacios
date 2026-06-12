export type TipoEspacio =
  | "aula"
  | "laboratorio"
  | "taller"
  | "oficina"
  | "auditorio"
  | "bano"
  | "deposito"
  | "circulacion"
  | "servicio";

export const TIPOS_INFO: Record<TipoEspacio, { etiqueta: string; color: string; accent: string }> = {
  aula: { etiqueta: "Aula", accent: "#8B5CF6", color: "bg-[#8B5CF6]/12 text-[#7C3AED]" },
  laboratorio: { etiqueta: "Laboratorio", accent: "#10B981", color: "bg-[#10B981]/12 text-[#0D9488]" },
  taller: { etiqueta: "Taller", accent: "#F59E0B", color: "bg-[#F59E0B]/15 text-[#B45309]" },
  oficina: { etiqueta: "Oficina", accent: "#3B82F6", color: "bg-[#3B82F6]/12 text-[#1D4ED8]" },
  auditorio: { etiqueta: "Auditorio / Gradas", accent: "#F97316", color: "bg-[#F97316]/14 text-[#C2410C]" },
  bano: { etiqueta: "Baño", accent: "#0EA5E9", color: "bg-[#0EA5E9]/12 text-[#0369A1]" },
  deposito: { etiqueta: "Depósito / Bodega", accent: "#64748B", color: "bg-[#64748B]/14 text-[#475569]" },
  circulacion: { etiqueta: "Circulación / Escaleras", accent: "#64748B", color: "bg-[#64748B]/10 text-[#475569]" },
  servicio: { etiqueta: "Servicios generales", accent: "#EC4899", color: "bg-[#EC4899]/12 text-[#BE185D]" },
};

export interface Espacio {
  id: string;
  codigo: string;
  nombre: string;
  tipo: TipoEspacio;
  bloqueId: string;
  planta: string;
  descripcion: string;
  capacidad?: number;
}

export interface PlantaBloque {
  id?: string;
  nombre: string;
  imagen: string;
}

export interface Bloque {
  id: string;
  nombre: string;
  resumen: string;
  descripcion: string;
  plantas: PlantaBloque[];
  /** Imagen general/portada del bloque (se usa cuando no hay contexto de planta específica). */
  imagen: string;
}
