import { create } from "zustand";

import { useUnsplashStore } from "./unsplash";
import { useTimerActions, useTimerStore, useTimerValue } from "./timer";
import { devtools } from "zustand/middleware";
import PuzzlePieces from "@/helpers/puzzle";
import { PuzzlePieceType, UnsplashImageData } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";
import { ArrayExtended } from "@/utils/array";

interface GameChallengeType {
  image: UnsplashImageData;
  completed: boolean;
  pieces: PuzzlePieceType[];
  complexity: number;
  moves: number;
  timerValue: number;
}

interface GameStoreActions {
  buildChallenges: () => Promise<void>;
  restartGame: () => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  getCurrentChallenge: () => GameChallengeType | null;
  triggerNextChallenge: () => void;
  checkChallengeValidity: (positions: Record<string, number>) => void;
  validChallenge: () => void;
  startGame: () => void;
  incrementChallengeMove: () => void;
  getScore: () => number;
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
      buildChallenges: async () => {
        // Grab images from the Unsplash store
        const { images } = useUnsplashStore.getState();
        if (!images || images.length === 0) {
          // Nothing to build
          set({ loading: false });
          return;
        }

        try {
          // For each image, fetch puzzle pieces, build a challenge
          const puzzlePromises = images.map(async (image) => {
            const puzzlePieces = await PuzzlePieces.getPuzzlePieces(
              PUZZLE_SLIDE_NUMBER
            );
            console.log("buildChallenges puzzlePieces", puzzlePieces);
            return {
              image,
              completed: false,
              pieces: puzzlePieces,
              complexity: PuzzlePieces.checkPuzzleComplexity(puzzlePieces),
            } as GameChallengeType;
          });

          // Resolve all puzzlePromises in parallel
          const newChallenges = await Promise.all(puzzlePromises);
          console.log("BUILDING challenges newChallenges", newChallenges);
          // Store them in the game state
          set({
            challenges: newChallenges,
          });
        } catch (err) {
          console.error("Error building challenges:", err);
        } finally {
          // Turn off loading, start game
          // Turn off loading, start game and start timer
          //TODO: Fix timer actions triggering
          // const { actions: timerActions } = useTimerStore.getState();
          // timerActions.reset();
          // timerActions.start();
          set({ loading: false, startTimer: true });
        }
      },

      nextChallenge: () => {
        const { currentChallengeIndex, challenges } = get();
        // If we can move to the next challenge, do so
        if (currentChallengeIndex < challenges.length - 1) {
          set({
            currentChallengeIndex: currentChallengeIndex + 1,
            startTimer: true,
          });
        } else {
          // Otherwise, we're at the last challenge
          set({ completed: true });
        }
        set({ needNextChallenge: false });
      },

      prevChallenge: () => {
        const { currentChallengeIndex } = get();
        if (currentChallengeIndex > 0) {
          set({ currentChallengeIndex: currentChallengeIndex - 1 });
        }
      },

      triggerNextChallenge: () => {
        const { challenges, currentChallengeIndex } = get();
        const { completed } = challenges[currentChallengeIndex];
        if (completed) {
          const { timerValue } = useTimerStore.getState();
          const updatedChallenges = [...challenges];
          updatedChallenges[currentChallengeIndex] = {
            ...updatedChallenges[currentChallengeIndex],
            timerValue,
          };
          set({
            challenges: updatedChallenges,
            needNextChallenge: true,
            startTimer: false,
          });
        }
      },

      getCurrentChallenge: () => {
        const { challenges, currentChallengeIndex } = get();
        return challenges[currentChallengeIndex] || null;
      },

      checkChallengeValidity: (positions: Record<string, number>) => {
        const ordered = PuzzlePieces.checkPuzzleOrderMobile(positions);
        console.log("Puzzle order check (from game store):", ordered);

        if (ordered) {
          const { challenges, currentChallengeIndex } = get();
          const { actions: timerActions } = useTimerStore.getState();
          timerActions.stop();
          const updatedChallenges = [...challenges];
          updatedChallenges[currentChallengeIndex] = {
            ...updatedChallenges[currentChallengeIndex],
            completed: true,
          };

          set({
            challenges: updatedChallenges,
          });
        }
      },

      validChallenge: () => {
        const { challenges, currentChallengeIndex } = get();

        const updatedChallenges = [...challenges];
        updatedChallenges[currentChallengeIndex] = {
          ...updatedChallenges[currentChallengeIndex],
          completed: true,
        };

        set({
          challenges: updatedChallenges,
          loading: false,
        });
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
      },

      incrementChallengeMove: () => {
        const { challenges, currentChallengeIndex } = get();

        const updatedChallenges = [...challenges];
        const currentChallenge = updatedChallenges[currentChallengeIndex];

        updatedChallenges[currentChallengeIndex] = {
          ...currentChallenge,
          moves: (currentChallenge.moves || 0) + 1,
        };

        set({ challenges: updatedChallenges });
      },

      getScore: () => {
        const { challenges } = get();
        const MAX_COMPLEXITY = 3;

        return challenges.reduce((totalScore, challenge) => {
          if (!challenge.completed) return totalScore;

          const { complexity, timerValue, moves } = challenge;
          console.log("complexity", complexity);
          console.log("timerValue", timerValue);
          console.log("moves", moves);
          // Convert timer from ms to seconds for finer granularity:
          const elapsedSec = timerValue / 1000;

          // Tier threshold (middle if complexity ≤ half of max)
          const midThreshold = Math.ceil(MAX_COMPLEXITY / 2);

          // Set ideal benchmarks and base score per tier:
          let idealTime: number;
          const idealMoves = complexity;
          let baseScore: number;

          if (complexity === 1) {
            // Easy
            idealTime = 1;
            baseScore = 100;
          } else if (complexity <= midThreshold) {
            // Middle
            idealTime = MAX_COMPLEXITY;
            baseScore = 150;
          } else {
            // Hard
            idealTime = MAX_COMPLEXITY * 2;
            baseScore = 200;
          }

          // Compute penalties
          const timePenalty = Math.max(0, elapsedSec - idealTime);
          console.log("Time penalty", timePenalty);
          const extraMoves = Math.max(0, moves - idealMoves);
          console.log("extraMoves", extraMoves);
          const movePenalty = extraMoves * 2;
          console.log("movePenalty", movePenalty);

          // Final per‐challenge score, clamped ≥ 0
          const challengeScore = Math.max(
            0,
            Math.round(baseScore - timePenalty - movePenalty)
          );
          console.log("challengeScore", challengeScore);
          console.log("--------------------------------");
          return totalScore + challengeScore;
        }, 0);
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
