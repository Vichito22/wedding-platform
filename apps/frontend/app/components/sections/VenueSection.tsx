// Datos del lugar de la boda
const VENUE = {
  name: "Casona del Huique",
  address: "Palmilla, Región de O'Higgins",
} as const;

// src del embed oficial de Google Maps (Compartir → Insertar un mapa).
// El parámetro "!1d" es el ancho visible del mapa en metros: subirlo aleja el
// zoom, bajarlo lo acerca (cada x2 equivale a un nivel de zoom).
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6572.29632897052!2d-71.3584971649703!3d-34.54980378936272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96647a21c834ee8f%3A0x3d8dd9bf308c8801!2sCasona%20Del%20Huique!5e0!3m2!1ses!2sus!4v1785463657513!5m2!1ses!2sus";

export default function VenueSection() {
  return (
    <section
      id="lugar"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <header className="space-y-4 text-center">
        <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 shadow-sm backdrop-blur">
          El lugar
        </div>
        <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {VENUE.name}
        </h2>
        <p className="text-base font-medium uppercase tracking-[0.24em] text-slate-500">
          {VENUE.address}
        </p>
        <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Nos encantará recibirte en este lugar tan especial para nosotros.
        </p>
      </header>

      {/* Mapa embebido de Google Maps (sin API key) */}
      <div className="mt-8 h-[320px] overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.12)] sm:h-[420px] lg:h-[480px]">
        <iframe
          src={MAP_EMBED_URL}
          title={`Mapa de ${VENUE.name}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>
    </section>
  );
}
