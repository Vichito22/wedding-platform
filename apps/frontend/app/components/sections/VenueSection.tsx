export default function VenueSection() {
  return (
    <section
      id="lugar"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <header className="space-y-4">
        <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 shadow-sm backdrop-blur">
          El lugar
        </div>
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Información del lugar
        </h2>
        <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Estamos afinando los últimos detalles. Pronto compartiremos aquí la
          ubicación y cómo llegar.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* TODO: agregar dirección, horario y cómo llegar cuando se confirme el lugar */}
        <div className="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Ubicación
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Por confirmar
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Aún no tenemos la ubicación definitiva. Vuelve a revisar esta sección
            más adelante para conocer la dirección y los detalles del evento.
          </p>
        </div>

        {/* TODO: reemplazar por un mapa / embed de Google Maps cuando se confirme */}
        <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 shadow-sm backdrop-blur">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Mapa por confirmar
          </span>
        </div>
      </div>
    </section>
  );
}
