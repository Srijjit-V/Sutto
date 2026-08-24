"use client";

import Link from "next/link";
import { useProgressStore } from "@/lib/game/store";
import { Mascot } from "./Mascot";

export function Header() {
  const xp = useProgressStore((s) => s.xp);
  const coins = useProgressStore((s) => s.coins);
  const streak = useProgressStore((s) => s.streak);

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b-4 border-[var(--color-border)] bg-[var(--color-card)]">
      <Link href="/" className="flex items-center gap-3">
        <Mascot state="idle" size={48} />
        <span className="text-2xl font-black tracking-tight">QueryQuest</span>
      </Link>
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="chunky-card px-3 py-1.5 bg-[var(--color-sunny)]">✨ {xp} XP</span>
        <span className="chunky-card px-3 py-1.5 bg-[var(--color-grass)]">🪙 {coins}</span>
        <span className="chunky-card px-3 py-1.5 bg-[var(--color-coral)]">🔥 {streak}</span>
        <Link href="/shop" className="chunky-btn px-4 py-1.5 bg-[var(--color-sky)] font-bold">
          Shop
        </Link>
      </div>
    </header>
  );
}
