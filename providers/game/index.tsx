import { PUZZLE_SLIDE_NUMBER } from "@/constants";
import PuzzlePieces from "@/helpers/puzzle";
import { useUnsplash } from "@/hooks/useUnsplash";
import { PuzzlePieceType, UnsplashImageData } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface GameContextType {
  challenges: GameChallengeType[];
  resetGame: () => void;
  currentChallengeIndex: number;
  nextChallenge: () => void;
  prevChallenge: () => void;
  getCurrentChallenge: () => GameChallengeType | null;
  isReady: boolean;
}

interface GameChallengeType {
  image: UnsplashImageData;
  completed: boolean;
  pieces: PuzzlePieceType[];
}

interface GameType {
  challenges: GameChallengeType[];
  score: number;
  completed: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { images, loading, error: imagesError } = useUnsplash();
  const [challenges, setChallenges] = useState<GameChallengeType[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  const buildChallenges = async () => {
    if (!images || images.length === 0) {
      // No images yet; nothing to build
      return;
    }

    try {
      // For each image, fetch puzzle pieces and build a new challenge object
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
      setChallenges(newChallenges);
      setIsReady(true);
    } catch (err) {
      console.error("Error building challenges:", err);
    }
  };

  // Return the currently selected challenge, or null if index out of range
  const getCurrentChallenge = () => {
    return challenges[currentChallengeIndex] || null;
  };

  // Move to the next challenge if not at the last one
  const nextChallenge = () => {
    setCurrentChallengeIndex((prevIndex) => {
      if (prevIndex < challenges.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  // Move to the previous challenge if not at the first one
  const prevChallenge = () => {
    setCurrentChallengeIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  useEffect(() => {
    if (!loading && images.length > 0 && !imagesError) {
      buildChallenges();
    }
  }, [images, loading, imagesError]);

  const resetGame = () => {
    setChallenges([]);
    setCurrentChallengeIndex(0);
    setIsReady(false);
  };

  return (
    <GameContext.Provider
      value={{
        challenges,
        resetGame,
        currentChallengeIndex,
        nextChallenge,
        prevChallenge,
        getCurrentChallenge,
        isReady,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
