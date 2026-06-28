// Galería de fotos de la pareja. Por ahora son placeholders.
// TODO: reemplazar por fotos reales en public/images/couple/ usando
// <Image src="/images/couple/foto-1.jpg" alt="..." fill className="object-cover" />
const PHOTO_PLACEHOLDERS = [
  { id: 1, span: "sm:col-span-2 sm:row-span-2" },
  { id: 2, span: "" },
  { id: 3, span: "" },
];

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 shadow-sm backdrop-blur">
          Nos casamos
        </div>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Vania <span className="text-amber-600">&amp;</span> Vladimir
        </h1>

        <p className="mt-4 text-base font-medium uppercase tracking-[0.28em] text-slate-500 sm:text-lg">
          6 de marzo de 2027
        </p>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Nos encantaría compartir este día tan especial contigo. Aquí
          encontrarás todos los detalles de nuestra boda.
        </p>
      </div>

      {/* Galería de fotos de la pareja (placeholders) */}
      <div className="mt-12 grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-3 sm:auto-rows-[200px]">
        {PHOTO_PLACEHOLDERS.map((photo) => (
          <div
            key={photo.id}
            className={`relative flex items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white/60 shadow-sm backdrop-blur ${photo.span}`}
          >
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
              Foto de la pareja
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
