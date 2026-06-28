"use client";

import { useState } from "react";
import Image from "next/image";

import ReserveGiftButton from "@/app/components/ReserveGiftButton";
import UnreserveGiftButton from "@/app/components/UnreserveGiftButton";
import type { PublicGift } from "@/app/components/sections/GiftsSection";

const PAGE_SIZE = 6;

function formatReservedBy(name: string | null): string {
  if (!name) return "un invitado";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
}

export default function GiftsList({ gifts }: { gifts: PublicGift[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleGifts = gifts.slice(0, visibleCount);
  const hasMore = visibleCount < gifts.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleGifts.map((gift) => (
          <article
            key={gift.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative aspect-[3/2] bg-slate-100">
              {gift.image_url ? (
                <Image
                  src={gift.image_url}
                  alt={gift.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="space-y-2 p-4">
              <h4 className="text-base font-semibold text-slate-950">
                {gift.name}
              </h4>

              {gift.description ? (
                <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                  {gift.description}
                </p>
              ) : null}

              <div className="pt-1">
                {gift.is_reserved ? (
                  <div className="space-y-2">
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">
                      Reservado por {formatReservedBy(gift.reserved_by)}
                    </span>
                    <UnreserveGiftButton giftId={gift.id} giftName={gift.name} />
                  </div>
                ) : (
                  <ReserveGiftButton giftId={gift.id} />
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Ver más regalos
          </button>
        </div>
      ) : null}
    </div>
  );
}
