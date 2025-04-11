import { useUnsplashStore } from "./unsplash";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import PuzzlePieces from "@/helpers/puzzle";
import { PuzzlePieceType, UnsplashImageData } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";

interface GameChallengeType {
  image: UnsplashImageData;
  completed: boolean;
  pieces: PuzzlePieceType[];
}

interface GameStoreActions {
  buildChallenges: () => Promise<void>;
  resetGame: () => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  getCurrentChallenge: () => GameChallengeType | null;
  checkPuzzleOrderMobile: (positions: Record<string, number>) => void;
}

interface GameStoreState {
  challenges: GameChallengeType[];
  currentChallengeIndex: number;
  isReady: boolean;
  completed: boolean;
  loading: boolean;
  actions: GameStoreActions;
}

export const useGameStore = create<GameStoreState>()(
  devtools((set, get) => ({
    challenges: [],
    currentChallengeIndex: 0,
    isReady: false,
    completed: false,
    loading: false,

    actions: {
      buildChallenges: async () => {
        // Turn on loading
        set({ loading: true });

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
            return {
              image,
              completed: false,
              pieces: puzzlePieces,
            } as GameChallengeType;
          });

          // Resolve all puzzlePromises in parallel
          const newChallenges = await Promise.all(puzzlePromises);

          // Store them in the game state
          set({
            challenges: newChallenges,
            isReady: true,
          });
        } catch (err) {
          console.error("Error building challenges:", err);
        } finally {
          // Turn off loading
          set({ loading: false });
        }
      },

      resetGame: () => {
        set({
          challenges: [],
          currentChallengeIndex: 0,
          isReady: false,
          completed: false, // Reset to false on new game
        });
      },

      nextChallenge: () => {
        const { currentChallengeIndex, challenges } = get();

        // If we can move to the next challenge, do so
        if (currentChallengeIndex < challenges.length - 1) {
          set({ currentChallengeIndex: currentChallengeIndex + 1 });
        } else {
          // Otherwise, we're at the last challenge
          set({ completed: true });
        }
      },

      prevChallenge: () => {
        const { currentChallengeIndex } = get();
        if (currentChallengeIndex > 0) {
          set({ currentChallengeIndex: currentChallengeIndex - 1 });
        }
      },

      getCurrentChallenge: () => {
        const { challenges, currentChallengeIndex } = get();
        return challenges[currentChallengeIndex] || null;
      },

      checkPuzzleOrderMobile: (positions: Record<string, number>) => {
        const ordered = PuzzlePieces.checkPuzzleOrderMobile(positions);
        console.log("Puzzle order check (from game store):", ordered);

        if (ordered) {
          const { challenges, currentChallengeIndex } = get();

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
    },
  }))
);

export const useGameStoreActions = () => useGameStore((state) => state.actions);
