import { fetchUnsplashImage } from "@/helpers/unsplash-photo";
import PuzzlePieces from "@/helpers/puzzle";
import { NUMBER_OF_QUESTION, PUZZLE_SLIDE_NUMBER } from "@/constants";
import { getRandomBoolean } from "@/utils/math";

export async function buildChallenges() {
  const images = await fetchUnsplashImage(NUMBER_OF_QUESTION, false);
  const challenges = await Promise.all(
    images.map(async (image) => {
      const pieces = await PuzzlePieces.getPuzzlePieces(PUZZLE_SLIDE_NUMBER);

      return {
        image,
        pieces,
        complexity: PuzzlePieces.checkPuzzleComplexity(pieces),
        isVertical: getRandomBoolean(),
      };
    })
  );
  console.log("Challenges built:", challenges);
  return challenges;
}

export function mockSendPromise(): Promise<
  {
    image: string;
    pieces: string[];
    complexity: number;
    isVertical: boolean;
  }[]
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          image: "Mock Image URL",
          pieces: ["piece1", "piece2", "piece3"],
          complexity: 3,
          isVertical: true,
        },
      ]);
    }, 2000);
  });
}
