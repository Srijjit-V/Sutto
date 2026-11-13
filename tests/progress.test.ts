import { describe, expect, it, beforeEach } from "vitest";
import { chapters } from "@/lib/game/chapters";
import { isChapterUnlocked, isChapterComplete } from "@/lib/game/unlock";

const { useProgressStore } = await import("@/lib/game/store");

beforeEach(() => {
  const storage = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => void storage.set(k, v),
    removeItem: (k) => void storage.delete(k),
    clear: () => storage.clear(),
    key: () => null,
    length: 0,
  };
  useProgressStore.setState({ xp: 0, coins: 0, streak: 0, lastPlayedDate: null, completedChallengeIds: [], ownedItemIds: [] });
});

describe("progress store", () => {
  it("awards a challenge only once", () => {
    const s = useProgressStore.getState();
    s.completeChallenge("ch1-q1", 10, 5);
    s.completeChallenge("ch1-q1", 10, 5);
    expect(useProgressStore.getState()).toMatchObject({ xp: 10, coins: 5, streak: 1 });
  });
  it("continues a streak from yesterday and resets after a gap", () => {
    const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
    useProgressStore.setState({ streak: 3, lastPlayedDate: day(1) });
    useProgressStore.getState().completeChallenge("a", 1, 1);
    expect(useProgressStore.getState().streak).toBe(4);
    useProgressStore.setState({ streak: 9, lastPlayedDate: day(3), completedChallengeIds: [] });
    useProgressStore.getState().completeChallenge("b", 1, 1);
    expect(useProgressStore.getState().streak).toBe(1);
  });
  it("buys an item once and never goes below zero coins", () => {
    useProgressStore.setState({ coins: 10 });
    const s = useProgressStore.getState();
    expect(s.buyItem("hat", 20)).toBe(false);
    expect(s.buyItem("hat", 10)).toBe(true);
    expect(useProgressStore.getState().buyItem("hat", 0)).toBe(false);
    expect(useProgressStore.getState().coins).toBe(0);
  });
});

describe("chapter unlocking", () => {
  const [c1, c2] = chapters;
  it("always unlocks chapter 1 and gates chapter 2 on chapter 1", () => {
    expect(isChapterUnlocked(c1, [])).toBe(true);
    expect(isChapterUnlocked(c2, [])).toBe(false);
    const done = c1.challenges.map((c) => c.id);
    expect(isChapterComplete(c1, done)).toBe(true);
    expect(isChapterUnlocked(c2, done)).toBe(true);
    expect(isChapterUnlocked(c2, done.slice(1))).toBe(false);
  });
});
