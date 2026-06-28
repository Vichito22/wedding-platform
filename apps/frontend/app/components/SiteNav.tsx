const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#regalos", label: "Regalos" },
  { href: "#cuenta-regresiva", label: "Cuenta regresiva" },
  { href: "#lugar", label: "Lugar" },
];

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-900"
        >
          Vania <span className="text-amber-600">&amp;</span> Vladimir
        </a>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 sm:text-sm">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-slate-950"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
