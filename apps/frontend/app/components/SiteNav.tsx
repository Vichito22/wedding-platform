"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#regalos", label: "Regalos" },
  { href: "#cuenta-regresiva", label: "Cuenta regresiva" },
  { href: "#lugar", label: "Lugar" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

function linkClasses(isActive: boolean) {
  return isActive ? "text-slate-950" : "text-slate-600 hover:text-slate-950";
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(SECTION_IDS[0]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function handleResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 sm:tracking-[0.28em]"
        >
          Vania <span className="text-amber-600">&amp;</span> Vladimir
        </a>

        <ul className="hidden items-center gap-x-5 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 md:flex sm:text-sm">
          {NAV_LINKS.map((link) => {
            const isActive = link.href.slice(1) === activeId;

            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`transition-colors ${linkClasses(isActive)} ${
                    isActive
                      ? "underline decoration-amber-600 decoration-2 underline-offset-8"
                      : ""
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-900/5 md:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3.5" y1="7" x2="20.5" y2="7" />
                <line x1="3.5" y1="12" x2="20.5" y2="12" />
                <line x1="3.5" y1="17" x2="20.5" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <>
          <div
            className="fixed inset-0 bg-slate-900/10 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-full border-b border-white/60 bg-white/95 shadow-[0_20px_40px_rgba(15,23,42,0.10)] backdrop-blur md:hidden"
          >
            <ul className="mx-auto flex w-full max-w-7xl flex-col px-2 py-2 text-sm font-medium uppercase tracking-[0.18em] sm:px-4">
              {NAV_LINKS.map((link) => {
                const isActive = link.href.slice(1) === activeId;

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={`block rounded-lg px-4 py-3 transition-colors hover:bg-slate-900/5 ${linkClasses(
                        isActive,
                      )}`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : null}
    </nav>
  );
}
