"use client";

import { Coins } from "lucide-react";
import { shopItems } from "@/lib/game/shopItems";
import { useProgressStore } from "@/lib/game/store";

export function Shop() {
  const coins = useProgressStore((s) => s.coins);
  const ownedItemIds = useProgressStore((s) => s.ownedItemIds);
  const buyItem = useProgressStore((s) => s.buyItem);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-heading text-2xl font-extrabold mb-1">Nibble&apos;s Shop</h1>
      <p className="mb-6 text-[var(--muted-foreground)]">
        Cosmetic-only — spend coins earned from challenges. Nothing here affects gameplay.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shopItems.map((item, i) => {
          const owned = ownedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="clay-card rise-in p-4 flex flex-col gap-2"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className="w-full h-10 rounded-[var(--radius-sm)] border-2 border-[var(--border)]"
                style={{ background: item.swatch }}
              />
              <h2 className="font-bold">{item.name}</h2>
              <p className="text-sm flex-1 text-[var(--muted-foreground)]">{item.description}</p>
              <button
                disabled={owned || coins < item.cost}
                onClick={() => buyItem(item.id, item.cost)}
                className="clay-btn flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {owned ? (
                  "Owned"
                ) : (
                  <>
                    <Coins className="size-4" aria-hidden /> {item.cost}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
