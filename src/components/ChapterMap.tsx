"use client";

import Link from "next/link";
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
            className={`chunky-card p-5 flex items-center justify-between gap-4 ${
              playable ? "" : "opacity-60"
            }`}
          >
            <div>
              <h2 className="text-lg font-black">{chapter.title}</h2>
              <p className="text-sm">{chapter.description}</p>
              {complete && <span className="text-sm font-bold">✅ Complete</span>}
            </div>
            <div className="text-3xl">
              {chapter.comingSoon ? "🔒" : unlocked ? (complete ? "🏆" : "▶️") : "🔒"}
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
