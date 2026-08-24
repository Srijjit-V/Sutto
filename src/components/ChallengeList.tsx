"use client";

import Link from "next/link";
import { getChapter } from "@/lib/game/chapters";
import { useProgressStore } from "@/lib/game/store";

export function ChallengeList({ chapterId }: { chapterId: string }) {
  const chapter = getChapter(chapterId);
  const completedChallengeIds = useProgressStore((s) => s.completedChallengeIds);
  if (!chapter) return null;

  return (
    <div className="flex flex-col gap-3">
      {chapter.challenges.map((challenge, i) => {
        const done = completedChallengeIds.includes(challenge.id);
        return (
          <Link
            key={challenge.id}
            href={`/chapter/${chapter.id}/challenge/${challenge.id}`}
            className="chunky-card p-4 flex items-center justify-between"
          >
            <span className="font-bold">
              {i + 1}. {challenge.title}
            </span>
            <span>{done ? "✅" : "▶️"}</span>
          </Link>
        );
      })}
    </div>
  );
}
