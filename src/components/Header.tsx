"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Sparkles, Coins, Flame, Store } from "lucide-react";
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
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b-4 border-[var(--border)] bg-[var(--card)]">
      <Link href="/" className="flex items-center gap-3 cursor-pointer">
        <Mascot state="idle" size={48} />
        <span className="font-heading text-2xl font-extrabold tracking-tight">QueryQuest</span>
      </Link>
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="clay-card flex items-center gap-1.5 px-3 py-1.5 bg-[var(--secondary)] text-[var(--secondary-foreground)]">
          <Sparkles className="size-4" aria-hidden /> {xp} XP
        </span>
        <span className="clay-card flex items-center gap-1.5 px-3 py-1.5 bg-[var(--coin)] text-[#1e1b4b]">
          <Coins className="size-4" aria-hidden /> {coins}
        </span>
        <span className="clay-card flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-[var(--accent-foreground)]">
          <Flame className="size-4" aria-hidden /> {streak}
        </span>
        <Link
          href="/shop"
          className="clay-btn flex items-center gap-1.5 px-4 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
        >
          <Store className="size-4" aria-hidden /> Shop
        </Link>
      </div>
    </header>
  );
}
