"use client";

import Link from "next/link";
import { useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Sparkles, Coins, Flame, Store, Compass } from "lucide-react";
import { useProgressStore, hydrateProgressStore } from "@/lib/game/store";
import { Mascot } from "./Mascot";

export function Header() {
  // Header renders on every page, so this is a convenient single place to
  // trigger the store's post-mount hydration from localStorage (see
  // skipHydration note in store.ts) — avoids an SSR hydration mismatch.
  useEffect(() => {
    hydrateProgressStore();
  }, []);

  const xp = useProgressStore((s) => s.xp);
  const coins = useProgressStore((s) => s.coins);
  const streak = useProgressStore((s) => s.streak);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b-4 border-[var(--border)] bg-[var(--card)]">
      <Link href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer">
        <Mascot state="idle" size={40} />
        <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight">QueryQuest</span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 text-sm font-bold flex-wrap">
        <span className="clay-card flex items-center gap-1.5 px-3 py-1.5 bg-[var(--secondary)] text-[var(--secondary-foreground)]">
          <Sparkles className="size-4" aria-hidden />
          <NumberFlow value={xp} />
          <span className="hidden sm:inline">XP</span>
        </span>
        <span className="clay-card flex items-center gap-1.5 px-3 py-1.5 bg-[var(--coin)] text-[#1e1b4b]">
          <Coins className="size-4" aria-hidden />
          <NumberFlow value={coins} />
        </span>
        <span className="clay-card flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-[var(--accent-foreground)]">
          <Flame className="size-4" aria-hidden />
          <NumberFlow value={streak} />
        </span>
        <Link
          href="/explore"
          className="clay-btn flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[var(--secondary)] text-[var(--secondary-foreground)] font-bold"
        >
          <Compass className="size-4" aria-hidden /> <span className="hidden sm:inline">Explore</span>
        </Link>
        <Link
          href="/shop"
          className="clay-btn flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
        >
          <Store className="size-4" aria-hidden /> <span className="hidden sm:inline">Shop</span>
        </Link>
      </div>
    </header>
  );
}
