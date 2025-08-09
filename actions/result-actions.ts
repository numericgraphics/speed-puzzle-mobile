// actions/result-actions.ts
import { useResultStore } from "@/stores/results";
import { GameChallengeType } from "@/stores/game";

/**
 * Compute the aggregated score for the current game.
 * Logic is lifted from `useGameStore.actions.getScore`.
 */
export async function getResultScore(): Promise<number> {
  const results = useResultStore.getState().getResults();
  const MAX_COMPLEXITY = 3;

  if (results.length === 0) return 0;

  return results.reduce((totalScore: number, challenge: GameChallengeType) => {
    const { complexity, timerValue, moves } = challenge;

    // Convert ms → s for finer granularity
    const elapsedSec = timerValue / 1000;

    // Tier threshold (middle tier if complexity ≤ half of max)
    const midThreshold = Math.ceil(MAX_COMPLEXITY / 2);

    // Ideal benchmarks & base score
    let idealTime: number;
    const idealMoves = complexity;
    let baseScore: number;

    if (complexity === 1) {
      idealTime = 1;
      baseScore = 100;
    } else if (complexity <= midThreshold) {
      idealTime = MAX_COMPLEXITY;
      baseScore = 150;
    } else {
      idealTime = MAX_COMPLEXITY * 2;
      baseScore = 200;
    }

    // Penalties
    const timePenalty = Math.max(0, elapsedSec - idealTime);
    const extraMoves = Math.max(0, moves - idealMoves);
    const movePenalty = extraMoves * 2;

    // Final clamped score for this challenge
    const challengeScore = Math.max(
      0,
      Math.round(baseScore - timePenalty - movePenalty)
    );

    return totalScore + challengeScore;
  }, 0);
}
