import type { Chapter } from "./types";
import { chapters } from "./chapters";

/** A chapter is unlocked once the previous chapter's challenges are all
 * complete. Chapter 1 is always unlocked. Chapters with no challenges yet
 * (comingSoon) never count as "complete" until they have real content. */
export function isChapterUnlocked(chapter: Chapter, completedChallengeIds: string[]): boolean {
  if (chapter.order === 1) return true;
  const previous = chapters.find((c) => c.order === chapter.order - 1);
  if (!previous || previous.challenges.length === 0) return false;
  return previous.challenges.every((c) => completedChallengeIds.includes(c.id));
}

export function isChapterComplete(chapter: Chapter, completedChallengeIds: string[]): boolean {
  if (chapter.challenges.length === 0) return false;
  return chapter.challenges.every((c) => completedChallengeIds.includes(c.id));
}
