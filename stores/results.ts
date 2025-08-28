import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GameChallengeType } from "./game";

// ------ currentChallenge slice ------
interface ResultSlice {
  score: number;
  results: GameChallengeType[];
  add: (challenge: GameChallengeType) => void;
  getResults: () => GameChallengeType[];
  reset: () => void;
}

export const useResultStore = create<ResultSlice>()(
  devtools((set, get) => ({
    score: NaN,
    results: [],
    getResults: () => get().results,
    add: (challenge: GameChallengeType) => {
      console.log("useResultStore Challenge completed!", challenge);
      set((state) => ({
        results: [...state.results, challenge],
      }));
    },
    reset: () => set({ results: [], score: 0 }),
  }))
);

export const useResultCompleted = () =>
  useResultStore((state) => state.results);
