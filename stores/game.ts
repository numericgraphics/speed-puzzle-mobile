import { create } from "zustand";
import { devtools } from "zustand/middleware";

import PuzzlePieces from "@/helpers/puzzle";
import { PuzzlePieceType, UnsplashImageData } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";
import { ArrayExtended } from "@/utils/array";
import { getRandomBoolean } from "@/utils/math";
// import { useUnsplashStore } from "./unsplash";
import { useTimerActions, useTimerStore, useTimerValue } from "./timer";
import { useChallengeStore } from "./challenges";
import { useResultCompleted, useResultStore } from "./results";

interface GameStoreActions {
  setChallenges: (challenges: GameChallengeType[]) => void;
  restartGame: () => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  getCurrentChallenge: () => GameChallengeType | null;
  triggerNextChallenge: () => void;
  startGame: () => void;
  incrementChallengeMove: () => void;
}

export interface GameChallengeType {
  image: UnsplashImageData;
  // completed: boolean;
  pieces: PuzzlePieceType[];
  complexity: number;
  moves: number;
  timerValue: number;
  isVertical: boolean;
}

interface GameStoreState {
  challenges: GameChallengeType[];
  currentChallengeIndex: number;
  needNextChallenge: boolean;
  started: boolean;
  completed: boolean;
  loading: boolean;
  startTimer: boolean;
  actions: GameStoreActions;
}

export const useGameStore = create<GameStoreState>()(
  devtools((set, get) => ({
    challenges: [],
    currentChallengeIndex: 0,
    needNextChallenge: false,
    started: false,
    completed: false,
    loading: false,
    startTimer: false,

    actions: {
      setChallenges: (challenges: GameChallengeType[]) => {
        set({ challenges });
      },

      nextChallenge: () => {
        console.log("GAME STORE - nextChallenge");
        const { currentChallengeIndex, challenges } = get();
        // If we can move to the next challenge, do so
        if (currentChallengeIndex < challenges.length - 1) {
          set({
            currentChallengeIndex: currentChallengeIndex + 1,
            startTimer: true,
          });
          useChallengeStore
            .getState()
            .setOrientation(challenges[currentChallengeIndex + 1].isVertical);
        } else {
          // Otherwise, we're at the last challenge
          set({ completed: true });
        }
        set({ needNextChallenge: false });
        useChallengeStore.getState().reset();
      },

      prevChallenge: () => {
        const { currentChallengeIndex } = get();
        if (currentChallengeIndex > 0) {
          set({ currentChallengeIndex: currentChallengeIndex - 1 });
        }
      },

      triggerNextChallenge: () => {
        console.log("GAME STORE - triggerNextChallenge");
        const { challenges, currentChallengeIndex } = get();

        const { timerValue } = useTimerStore.getState();
        const { currentMove } = useChallengeStore.getState();
        const updatedChallenges = [...challenges];
        updatedChallenges[currentChallengeIndex] = {
          ...updatedChallenges[currentChallengeIndex],
          timerValue,
          moves: currentMove,
        };
        useResultStore.getState().add(updatedChallenges[currentChallengeIndex]);
        set({
          needNextChallenge: true,
          startTimer: false,
        });
      },

      getCurrentChallenge: () => {
        const { challenges, currentChallengeIndex } = get();
        return challenges[currentChallengeIndex] || null;
      },

      startGame: () => {
        // Turn on loading
        set({ loading: true, started: true, challenges: [] });
      },

      restartGame: () => {
        set({
          loading: true,
          currentChallengeIndex: 0,
          completed: false, // Reset to false on new game
          challenges: [],
          needNextChallenge: false,
        });
        useChallengeStore.getState().reset();
        useResultStore.getState().reset();
      },

      incrementChallengeMove: () => {
        useChallengeStore.getState().increment();
      },
    },
  }))
);

export const useNeedNextChallenge = () =>
  useGameStore((state) => state.needNextChallenge);

export const useGameStoreStarted = () => useGameStore((state) => state.started);
export const useGameStoreStartTimer = () =>
  useGameStore((state) => state.startTimer);

export const useGameStoreActions = () => useGameStore((state) => state.actions);
