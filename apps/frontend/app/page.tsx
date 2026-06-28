import SiteNav from "@/app/components/SiteNav";
import HeroSection from "@/app/components/sections/HeroSection";
import GiftsSection, {
  type PublicGift,
} from "@/app/components/sections/GiftsSection";
import VenueSection from "@/app/components/sections/VenueSection";
import CountdownTimer from "@/app/components/CountdownTimer";

async function loadPublicGifts(): Promise<PublicGift[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/gifts`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { gifts?: PublicGift[] };
    return data.gifts ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const gifts = await loadPublicGifts();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#f8fafc_36%,#eef2ff_100%)] text-slate-900">
      <SiteNav />

      <HeroSection />

      <GiftsSection gifts={gifts} />

      <section
        id="cuenta-regresiva"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
      >
        <header className="space-y-4 text-center">
          <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 shadow-sm backdrop-blur">
            Falta poco
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Cuenta regresiva
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            El gran día es el 6 de marzo de 2027. ¡Te esperamos!
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
          <CountdownTimer />
        </div>
      </section>

      <VenueSection />

      <footer className="mx-auto w-full max-w-7xl px-4 py-10 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        Hecho con cariño para nuestra boda.
      </footer>
    </main>
  );
}
