"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// Fotos de la pareja. Los archivos viven en public/images/couple/.
// `position` ajusta el recorte de object-cover para que las caras no queden fuera.
const PHOTOS = [
  {
    src: "/images/couple/propuesta.jpg",
    alt: "Vania mostrando su anillo de compromiso junto a Vladimir, frente a la laguna",
    width: 1600,
    height: 1204,
    span: "col-span-2 row-span-2",
    position: "object-[center_35%]",
    sizes: "(max-width: 640px) 100vw, 50vw",
  },
  {
    src: "/images/couple/puente.jpg",
    alt: "Vania y Vladimir mirándose en el puente de madera sobre la laguna",
    width: 1200,
    height: 1600,
    span: "col-span-1 row-span-2",
    position: "object-center",
    sizes: "(max-width: 640px) 50vw, 25vw",
  },
  {
    src: "/images/couple/playa.jpg",
    alt: "Vania y Vladimir abrazados en el mirador frente al mar",
    width: 900,
    height: 1600,
    span: "col-span-1 row-span-2",
    position: "object-[center_30%]",
    sizes: "(max-width: 640px) 50vw, 25vw",
  },
];

export default function CoupleGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const move = useCallback((step: number) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + step + PHOTOS.length) % PHOTOS.length;
    });
  }, []);

  useEffect(() => {
    if (openIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex, close, move]);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 auto-rows-[140px] gap-3 sm:grid-cols-4 sm:auto-rows-[190px] sm:gap-4">
        {PHOTOS.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Ver foto: ${photo.alt}`}
            className={`group relative overflow-hidden rounded-3xl border border-white/80 bg-slate-100 shadow-[0_20px_80px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 ${photo.span}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              sizes={photo.sizes}
              className={`object-cover ${photo.position} transition-transform duration-500 group-hover:scale-105`}
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto de la pareja"
          onClick={close}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-slate-950/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/20"
          >
            &times;
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            &lsaquo;
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            &rsaquo;
          </button>

          <Image
            src={PHOTOS[openIndex].src}
            alt={PHOTOS[openIndex].alt}
            width={PHOTOS[openIndex].width}
            height={PHOTOS[openIndex].height}
            sizes="100vw"
            onClick={(event) => event.stopPropagation()}
            className="h-auto max-h-[80vh] w-auto max-w-[92vw] rounded-2xl object-contain"
          />

          <p className="max-w-2xl px-8 text-center text-xs font-medium uppercase tracking-[0.22em] text-white/70">
            {PHOTOS[openIndex].alt}
            <span className="ml-3 text-white/40">
              {openIndex + 1} / {PHOTOS.length}
            </span>
          </p>
        </div>
      ) : null}
    </>
  );
}
