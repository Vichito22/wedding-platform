"use client";

import { ChangeEvent, useEffect, useMemo } from "react";

import { resolveGiftImageSrc } from "@/app/utils/gifts";

interface GiftImageFieldProps {
  // Imagen ya guardada en el regalo (null si no tiene o si se quito).
  currentImageUrl: string | null;
  // Archivo elegido y aun no subido.
  file: File | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function GiftImageField({
  currentImageUrl,
  file,
  onFileChange,
  onRemove,
  disabled = false,
}: GiftImageFieldProps) {
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  // Libera el blob cuando cambia el archivo o se desmonta el formulario.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const src =
    previewUrl ??
    (currentImageUrl ? resolveGiftImageSrc(currentImageUrl) : null);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
    // Se limpia el input para que elegir el mismo archivo otra vez
    // vuelva a disparar onChange.
    event.target.value = "";
  };

  const handleRemove = () => {
    onFileChange(null);
    onRemove();
  };

  return (
    <div className="space-y-2">
      <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
        {src ? (
          // Se usa <img> y no next/image porque la vista previa es un blob:
          // local y esta pantalla es privada (no necesita optimizacion).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt="Vista previa de la imagen del regalo"
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Sin imagen
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <label
          className={`flex-1 cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-center text-sm text-slate-700 hover:bg-slate-50 ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {src ? "Cambiar imagen" : "Subir imagen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={handleSelect}
          />
        </label>

        {src ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Quitar
          </button>
        ) : null}
      </div>

      <p className="text-xs text-slate-500">JPG, PNG o WEBP. Maximo 5 MB.</p>
    </div>
  );
}
