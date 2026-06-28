import GiftsList from "@/app/components/sections/GiftsList";

export interface PublicGift {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  price_reference: string | null;
  category: string | null;
  is_reserved: boolean;
  reserved_by: string | null;
  position_order: number;
}

export default function GiftsSection({ gifts }: { gifts: PublicGift[] }) {
  return (
    <section
      id="regalos"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <header className="space-y-4">
        <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 shadow-sm backdrop-blur">
          Lista de regalos
        </div>
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Regalos
        </h2>
        <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Aquí puedes ver los regalos que quieren los novios, con su imagen y
          precio de referencia.
        </p>
      </header>

      <div className="mt-8 rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Lista pública
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              Regalos publicados
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {gifts.length} items
          </span>
        </div>

        <div className="mt-6">
          {gifts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-500">
              Aun no hay regalos publicados.
            </div>
          ) : (
            <GiftsList gifts={gifts} />
          )}
        </div>
      </div>
    </section>
  );
}
