import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ------ currentChallenge slice ------
interface CurrentChallengeSlice {
  currentMove: number;
  completed: boolean;
  increment: () => void;
  markCompleted: () => void;
  reset: () => void;
}

export const useChallengeStore = create<CurrentChallengeSlice>()(
  devtools((set) => ({
    currentMove: 0,
    completed: false,
    increment: () => set((state) => ({ currentMove: state.currentMove + 1 })),
    markCompleted: () => {
      console.log("useChallengeStore Challenge completed!");
      set({ completed: true });
    },
    reset: () => set({ currentMove: 0, completed: false }),
  }))
);

export const useChallengeStoreCompleted = () =>
  useChallengeStore((state) => state.completed);
