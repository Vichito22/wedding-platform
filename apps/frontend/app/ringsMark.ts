import { AMBER } from "@/app/siteConfig";

interface RingsMarkOptions {
  stroke?: string;
  /**
   * Grosor del trazo sobre un viewBox de 32. El valor por defecto es
   * deliberadamente grueso: a 16px (el tamaño de la pestaña del navegador) un
   * trazo fino se convierte en un borrón gris. A tamaño grande conviene bajarlo.
   */
  strokeWidth?: number;
  /** Fondo redondeado detrás de los anillos; omitir para dejarlo transparente. */
  background?: string;
}

/**
 * Dos anillos entrelazados. El tercer trazo vuelve a dibujar el arco superior
 * del anillo izquierdo por encima del derecho: es lo que da el efecto de
 * entrelazado en lugar de dos círculos simplemente superpuestos.
 */
export function ringsMarkSvg({
  stroke = AMBER,
  strokeWidth = 2.4,
  background,
}: RingsMarkOptions = {}) {
  const backdrop = background
    ? `<rect width="32" height="32" rx="7" fill="${background}"/>`
    : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">`,
    backdrop,
    `<g fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round">`,
    `<circle cx="11.5" cy="18" r="6"/>`,
    `<circle cx="20.5" cy="18" r="6"/>`,
    `<path d="M14.50 12.80 A 6 6 0 0 1 17.14 15.95"/>`,
    `</g>`,
    `</svg>`,
  ].join("");
}

/** El mismo trazo como data URI, para usarlo en `<img>` dentro de ImageResponse. */
export function ringsMarkDataUri(options: RingsMarkOptions = {}) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(ringsMarkSvg(options))}`;
}
