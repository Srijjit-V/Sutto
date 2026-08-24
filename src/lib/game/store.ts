"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  xp: number;
  coins: number;
  streak: number;
  lastPlayedDate: string | null; // ISO date (yyyy-mm-dd), for streak tracking
  completedChallengeIds: string[];
  ownedItemIds: string[];

  completeChallenge: (challengeId: string, xpReward: number, coinReward: number) => void;
  isChallengeComplete: (challengeId: string) => boolean;
  buyItem: (itemId: string, cost: number) => boolean;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      streak: 0,
      lastPlayedDate: null,
      completedChallengeIds: [],
      ownedItemIds: [],

      completeChallenge: (challengeId, xpReward, coinReward) => {
        const state = get();
        if (state.completedChallengeIds.includes(challengeId)) return;

        const today = todayIso();
        let streak = state.streak;
        if (state.lastPlayedDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          streak = state.lastPlayedDate === yesterday ? state.streak + 1 : 1;
        }

        set({
          xp: state.xp + xpReward,
          coins: state.coins + coinReward,
          streak,
          lastPlayedDate: today,
          completedChallengeIds: [...state.completedChallengeIds, challengeId],
        });
      },

      isChallengeComplete: (challengeId) => get().completedChallengeIds.includes(challengeId),

      buyItem: (itemId, cost) => {
        const state = get();
        if (state.ownedItemIds.includes(itemId) || state.coins < cost) return false;
        set({ coins: state.coins - cost, ownedItemIds: [...state.ownedItemIds, itemId] });
        return true;
      },
    }),
    {
      name: "queryquest-progress",
      // Skip auto-hydration on store creation: with Next.js SSR, the server
      // has no localStorage, so it always renders the default (zero) state.
      // If the client rehydrated synchronously during store creation, its
      // very first render would already show the real persisted values —
      // mismatching the server-rendered HTML and triggering a hydration
      // error. Instead we hydrate explicitly, after mount (see
      // useHydrateProgressStore below), so the first client render matches
      // the server, then updates a moment later like any normal state change.
      skipHydration: true,
    }
  )
);

/** Call once, client-side, after mount (e.g. in a top-level layout effect)
 * to load persisted progress from localStorage. See the skipHydration note
 * above for why this isn't automatic. */
export function hydrateProgressStore() {
  useProgressStore.persist.rehydrate();
}
