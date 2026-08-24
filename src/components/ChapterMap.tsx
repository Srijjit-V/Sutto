"use client";

import Link from "next/link";
import { Lock, Trophy, PlayCircle } from "lucide-react";
import { chapters } from "@/lib/game/chapters";
import { isChapterUnlocked, isChapterComplete } from "@/lib/game/unlock";
import { useProgressStore } from "@/lib/game/store";

export function ChapterMap() {
  const completedChallengeIds = useProgressStore((s) => s.completedChallengeIds);

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-6">
      {chapters.map((chapter) => {
        const unlocked = isChapterUnlocked(chapter, completedChallengeIds);
        const complete = isChapterComplete(chapter, completedChallengeIds);
        const playable = unlocked && !chapter.comingSoon;

        const card = (
          <div
            className={`clay-card p-5 flex items-center justify-between gap-4 ${
              playable ? "cursor-pointer" : "opacity-60"
            }`}
          >
            <div>
              <h2 className="font-heading text-lg font-bold">{chapter.title}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{chapter.description}</p>
              {complete && (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--success)] mt-1">
                  <Trophy className="size-4" aria-hidden /> Complete
                </span>
              )}
            </div>
            <div className="shrink-0">
              {chapter.comingSoon || !unlocked ? (
                <Lock className="size-7 text-[var(--muted-foreground)]" aria-hidden />
              ) : complete ? (
                <Trophy className="size-7 text-[var(--coin)]" aria-hidden />
              ) : (
                <PlayCircle className="size-7 text-[var(--primary)]" aria-hidden />
              )}
            </div>
          </div>
        );

        return playable ? (
          <Link key={chapter.id} href={`/chapter/${chapter.id}`}>
            {card}
          </Link>
        ) : (
          <div key={chapter.id}>{card}</div>
        );
      })}
    </div>
  );
}
