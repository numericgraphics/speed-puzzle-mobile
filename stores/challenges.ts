import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ------ currentChallenge slice ------
interface CurrentChallengeSlice {
  isVertical: boolean;
  currentMove: number;
  completed: boolean;
  increment: () => void;
  markCompleted: () => void;
  setOrientation: (isVertical: boolean) => void;
  reset: () => void;
}

export const useChallengeStore = create<CurrentChallengeSlice>()(
  devtools((set) => ({
    currentMove: 0,
    completed: false,
    isVertical: false,
    increment: () =>
      set((state) => ({ ...state, currentMove: state.currentMove + 1 })),
    markCompleted: () => {
      set((state) => ({ ...state, completed: true }));
    },
    reset: () => set({ currentMove: 0, completed: false }),
    setOrientation: (isVertical: boolean) =>
      set((state) => ({ ...state, isVertical })),
  }))
);

export const useChallengeStoreCompleted = () =>
  useChallengeStore((state) => state.completed);
