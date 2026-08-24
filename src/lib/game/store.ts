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
    { name: "queryquest-progress" }
  )
);
