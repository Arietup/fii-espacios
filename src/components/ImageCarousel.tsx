"use client";

import { useId, useMemo, useState } from "react";
import Icon from "@/components/Icon";

export type CarouselImage = {
  id: string;
  nombre?: string | null;
  descripcion?: string | null;
  mimeType: string;
  base64: string;
};

function imagenBase64Src(img: { mimeType: string; base64: string }) {
  return `data:${img.mimeType};base64,${img.base64}`;
}

export default function ImageCarousel({
  imagenPrincipal,
  imagenesSecundarias,
  alt,
  className = "",
}: {
  imagenPrincipal?: CarouselImage | null;
  imagenesSecundarias?: CarouselImage[];
  alt: string;
  className?: string;
}) {
  const imagenes = useMemo(
    () => [imagenPrincipal, ...(imagenesSecundarias ?? [])].filter(Boolean) as CarouselImage[],
    [imagenPrincipal, imagenesSecundarias],
  );

  const [index, setIndex] = useState(0);
  const actual = imagenes[index];
  const liveId = useId();

  if (!actual) return null;

  const total = imagenes.length;

  function move(delta: number) {
    setIndex((current) => (current + delta + total) % total);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft")  { e.preventDefault(); move(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
    if (e.key === "Home")       { e.preventDefault(); setIndex(0); }
    if (e.key === "End")        { e.preventDefault(); setIndex(total - 1); }
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--secondary)] ${className}`}
      role="region"
      aria-label={`Galería de imágenes: ${alt}`}
      aria-roledescription="carrusel"
    >
      {/* Anuncio de imagen actual para lectores de pantalla */}
      <div
        id={liveId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Imagen {index + 1} de {total}: {actual.nombre ?? alt}
        {actual.descripcion ? `. ${actual.descripcion}` : ""}
      </div>

      {/* Imagen principal */}
      <div
        className="relative aspect-[16/9] w-full"
        onKeyDown={total > 1 ? handleKeyDown : undefined}
        tabIndex={total > 1 ? 0 : undefined}
        role={total > 1 ? "group" : undefined}
        aria-label={total > 1 ? "Usa las flechas del teclado para navegar entre imágenes" : undefined}
      >
        <img
          src={imagenBase64Src(actual)}
          alt={actual.nombre ?? alt}
          className="h-full w-full object-contain p-3"
          aria-describedby={actual.descripcion ? `${liveId}-desc` : undefined}
        />
        {actual.descripcion && (
          <span id={`${liveId}-desc`} className="sr-only">{actual.descripcion}</span>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={`Imagen anterior (${index === 0 ? total : index} de ${total})`}
              aria-controls={liveId}
              className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--text)] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <Icon name="arrowLeft" className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label={`Imagen siguiente (${index + 2 > total ? 1 : index + 2} de ${total})`}
              aria-controls={liveId}
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--text)] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <Icon name="arrowRight" className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Contador visual */}
            <span
              aria-hidden="true"
              className="absolute bottom-2 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              {index + 1}/{total}
            </span>
          </>
        )}
      </div>

      {/* Pie: nombre, descripción y miniaturas */}
      <div className="border-t border-[var(--border-soft)] bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{actual.nombre ?? alt}</p>
            {actual.descripcion && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">{actual.descripcion}</p>
            )}
          </div>
        </div>

        {total > 1 && (
          <div
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Miniaturas de imágenes"
          >
            {imagenes.map((imagen, imgIndex) => (
              <button
                key={imagen.id}
                type="button"
                role="tab"
                aria-selected={imgIndex === index}
                aria-label={`Ver imagen ${imgIndex + 1}${imagen.nombre ? `: ${imagen.nombre}` : ""}`}
                aria-controls={liveId}
                onClick={() => setIndex(imgIndex)}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border bg-[var(--secondary)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 ${
                  imgIndex === index
                    ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                    : "border-[var(--border-soft)] hover:border-[var(--text-muted)]"
                }`}
              >
                <img
                  src={imagenBase64Src(imagen)}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
