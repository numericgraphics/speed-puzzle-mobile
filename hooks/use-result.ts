// actions/result-actions.ts
import { useCallback } from "react";
import { useResultStore } from "@/stores/results";
import type { GameChallengeType } from "@/stores/game";
import { api } from "@/lib/api";

/**
 * React hook exposing result-related actions:
 * - getResultScore(): compute aggregated score from the in-memory results store
 * - getScores(limit?): fetch scores from backend (bottom list by default)
 * - getResultSessionData(): compute local result + fetch scores together
 */
export function useResult() {
  /**
   * Compute the aggregated score for the current game.
   * Logic lifted from the original getResultScore function.
   */
  const getResultScore = useCallback(async (): Promise<number> => {
    const results = useResultStore.getState().getResults();
    const MAX_COMPLEXITY = 3;

    if (results.length === 0) return 0;

    return results.reduce(
      (totalScore: number, challenge: GameChallengeType) => {
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
      },
      0
    );
  }, []);

  /**
   * Fetches the scores from the backend.
   * Uses the `bottomScores` endpoint to mirror previous behavior.
   * Returns the raw array of scores.
   */
  const getScores = useCallback(
    async (limit = 10) => {
      const res = await api.bottomScores(limit); // { limit, scores }
      return res.scores ?? [];
    },
    [api]
  );

  /**
   * Retrieves both the calculated result and the current scores in parallel.
   */
  const getResultSessionData = useCallback(async () => {
    const [result, topScores] = await Promise.all([
      getResultScore(),
      getScores(),
    ]);
    return { result, topScores };
  }, [getResultScore, getScores]);

  return { getResultScore, getScores, getResultSessionData };
}
