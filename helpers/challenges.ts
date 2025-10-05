import { NUMBER_OF_QUESTION, PUZZLE_SLIDE_NUMBER, USE_MOCK } from "@/constants";
import { mockUnsplashApiCall } from "@/mock/promises/unsplash-api-call";
import { UnsplashImageData } from "@/types";
import { getRandomBoolean } from "@/utils/math";
import { api } from "@/lib/api";
import PuzzlePieces from "./puzzle";

export async function buildChallenges() {
  let images: UnsplashImageData[] = [];
  if (USE_MOCK) {
    const imagesURLTemp = await mockUnsplashApiCall();
    images = imagesURLTemp.data;
  } else {
    images = await api.fetchUnsplashImage(NUMBER_OF_QUESTION);
  }
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
