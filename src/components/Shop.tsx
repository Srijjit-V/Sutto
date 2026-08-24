"use client";

import { shopItems } from "@/lib/game/shopItems";
import { useProgressStore } from "@/lib/game/store";

export function Shop() {
  const coins = useProgressStore((s) => s.coins);
  const ownedItemIds = useProgressStore((s) => s.ownedItemIds);
  const buyItem = useProgressStore((s) => s.buyItem);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-1">Nibble&apos;s Shop</h1>
      <p className="mb-6">Cosmetic-only — spend coins earned from challenges. Nothing here affects gameplay.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shopItems.map((item) => {
          const owned = ownedItemIds.includes(item.id);
          return (
            <div key={item.id} className="chunky-card p-4 flex flex-col gap-2">
              <div className="w-full h-10 rounded-lg border-2 border-[var(--color-border)]" style={{ background: item.swatch }} />
              <h2 className="font-bold">{item.name}</h2>
              <p className="text-sm flex-1">{item.description}</p>
              <button
                disabled={owned || coins < item.cost}
                onClick={() => buyItem(item.id, item.cost)}
                className="chunky-btn px-4 py-2 bg-[var(--color-grass)] font-bold text-sm disabled:opacity-50"
              >
                {owned ? "Owned" : `🪙 ${item.cost}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
