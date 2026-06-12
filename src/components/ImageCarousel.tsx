"use client";

import { useMemo, useState } from "react";
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

  if (!actual) return null;

  function move(delta: number) {
    setIndex((current) => (current + delta + imagenes.length) % imagenes.length);
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--secondary)] ${className}`}>
      <div className="relative aspect-[16/9] w-full">
        <img
          src={imagenBase64Src(actual) ?? ""}
          alt={actual.nombre ?? alt}
          className="h-full w-full object-contain p-3"
        />
        {imagenes.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--text)] shadow-sm hover:bg-white"
              aria-label="Imagen anterior"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--text)] shadow-sm hover:bg-white"
              aria-label="Imagen siguiente"
            >
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      <div className="border-t border-[var(--border-soft)] bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{actual.nombre ?? alt}</p>
            {actual.descripcion && <p className="mt-1 text-xs text-[var(--text-muted)]">{actual.descripcion}</p>}
          </div>
          {imagenes.length > 1 && <span className="text-xs text-[var(--text-muted)]">{index + 1}/{imagenes.length}</span>}
        </div>
        {imagenes.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {imagenes.map((imagen, imgIndex) => (
              <button
                key={imagen.id}
                type="button"
                onClick={() => setIndex(imgIndex)}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border bg-[var(--secondary)] ${
                  imgIndex === index ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-[var(--border-soft)]"
                }`}
                aria-label={`Ver imagen ${imgIndex + 1}`}
              >
                <img src={imagenBase64Src(imagen) ?? ""} alt="" className="h-full w-full object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
