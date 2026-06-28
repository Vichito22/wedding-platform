import HealthCheckButton from "@/app/components/HealthCheckButton";
import DBConnectionButton from "@/app/components/DBConnectionButton";
import ReserveGiftButton from "@/app/components/ReserveGiftButton";
import Image from "next/image";
import Link from "next/link";

interface PublicGift {
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

function formatPrice(value: string | null) {
  if (!value) {
    return "Valor no especificado";
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export default async function Home() {
  const gifts = await loadPublicGifts();
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#f8fafc_36%,#eef2ff_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-4 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row">
            <HealthCheckButton />
            <DBConnectionButton />
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-white hover:text-slate-950"
            >
              Ir al panel de administrador
            </Link>
          </div>
        </div>

        <header className="space-y-4">
          <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 shadow-sm backdrop-blur">
            Wedding Platform
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Regalos
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Aquí puedes ver los regalos que quieren los novios, con su imagen y
            precio de referencia.
          </p>
        </header>

        <section className="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Lista pública
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Regalos publicados
              </h2>
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
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {gifts.map((gift) => (
                  <article
                    key={gift.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      {gift.image_url ? (
                        <Image
                          src={gift.image_url}
                          alt={gift.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800">
                          Orden {gift.position_order}
                        </span>
                        {gift.category ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                            {gift.category}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="text-lg font-semibold text-slate-950">
                        {gift.name}
                      </h3>

                      {gift.description ? (
                        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                          {gift.description}
                        </p>
                      ) : null}

                      <p className="text-sm font-semibold text-slate-900">
                        {formatPrice(gift.price_reference)}
                      </p>

                      <div className="pt-1">
                        {gift.is_reserved ? (
                          <span className="inline-flex w-full items-center justify-center rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">
                            Reservado por {gift.reserved_by ?? "un invitado"}
                          </span>
                        ) : (
                          <ReserveGiftButton giftId={gift.id} />
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
