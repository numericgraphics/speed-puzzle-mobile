// actions/result-actions.ts
import { useResultStore } from "@/stores/results";
import { GameChallengeType } from "@/stores/game";

/*────────────────  tunable constants  ────────────────*/
const TIME_PER_PIECE = 2; // ideal seconds per puzzle piece
const TIME_WEIGHT = 0.7; // speed importance   (0-1)
const MOVE_WEIGHT = 0.3; // move efficiency    (0-1)

/*────────────────  per-challenge score  ────────────────*/
export function computeChallengeScore({
  complexity,
  timerValue, // milliseconds
  moves,
}: GameChallengeType): number {
  if (complexity <= 0) return 0;

  const elapsedSec = timerValue / 1000;
  const idealTime = complexity * TIME_PER_PIECE;

  const timeRatio = Math.min(1, idealTime / Math.max(elapsedSec, 0.001));
  const moveRatio = Math.min(1, complexity / Math.max(moves, 1));

  const efficiency =
    (TIME_WEIGHT * timeRatio + MOVE_WEIGHT * moveRatio) /
    (TIME_WEIGHT + MOVE_WEIGHT);

  return Math.round(efficiency * complexity * 100); // scale by difficulty
}

/*────────────────  aggregated game score  ────────────────*/
export async function getResultScore(): Promise<number> {
  const results = useResultStore.getState().getResults();
  if (results.length === 0) return 0;

  return results.reduce((total, ch) => total + computeChallengeScore(ch), 0);
}

/**
 * Compute the aggregated score for the current game.
 * Logic is lifted from `useGameStore.actions.getScore`.
 */
// export async function getResultScore(): Promise<number> {
//   const results = useResultStore.getState().getResults();
//   const MAX_COMPLEXITY = 3;

//   if (results.length === 0) return 0;

//   return results.reduce((totalScore: number, challenge: GameChallengeType) => {
//     const { complexity, timerValue, moves } = challenge;

//     // Convert ms → s for finer granularity
//     const elapsedSec = timerValue / 1000;

//     // Tier threshold (middle tier if complexity ≤ half of max)
//     const midThreshold = Math.ceil(MAX_COMPLEXITY / 2);

//     // Ideal benchmarks & base score
//     let idealTime: number;
//     const idealMoves = complexity;
//     let baseScore: number;

//     if (complexity === 1) {
//       idealTime = 1;
//       baseScore = 100;
//     } else if (complexity <= midThreshold) {
//       idealTime = MAX_COMPLEXITY;
//       baseScore = 150;
//     } else {
//       idealTime = MAX_COMPLEXITY * 2;
//       baseScore = 200;
//     }

//     // Penalties
//     const timePenalty = Math.max(0, elapsedSec - idealTime);
//     const extraMoves = Math.max(0, moves - idealMoves);
//     const movePenalty = extraMoves * 2;

//     // Final clamped score for this challenge
//     const challengeScore = Math.max(
//       0,
//       Math.round(baseScore - timePenalty - movePenalty)
//     );

//     return totalScore + challengeScore;
//   }, 0);
// }
