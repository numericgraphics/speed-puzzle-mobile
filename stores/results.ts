import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GameChallengeType } from "./game";

// ------ currentChallenge slice ------
interface ResultSlice {
  results: GameChallengeType[];
  add: (challenge: GameChallengeType) => void;
  getResults: () => GameChallengeType[];
  reset: () => void;
}

export const useResultStore = create<ResultSlice>()(
  devtools((set, get) => ({
    results: [],
    getResults: () => get().results,
    add: (challenge: GameChallengeType) => {
      console.log("useResultStore Challenge completed!", challenge);
      set((state) => ({
        results: [...state.results, challenge],
      }));
    },
    reset: () => set({ results: [] }),
  }))
);

export const useResultCompleted = () =>
  useResultStore((state) => state.results);
