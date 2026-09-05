// actions/result-actions.ts
import { useCallback } from "react";
import { useResultStore } from "@/stores/results";
import { api } from "@/lib/api";
import { computeTotalScore } from "@/helpers/scores";
import { log } from "@/lib/logger";

/**
 * React hook exposing result-related actions:
 * - getResultScore(): compute aggregated score from the in-memory results store
 * - getRegisteredScores(limit?): fetch the top (highest) scores from backend
 * - getScoresForResultSection(): compute local result + fetch scores together
 */
export function useScores() {
  /**
   * Compute the aggregated score for the current game.
   */
  const getScore = useCallback(async (): Promise<number> => {
    const results = useResultStore.getState().getResults();
    const score = computeTotalScore(results);
    log.scores.debug(
      "getScore",
      JSON.stringify({ resultsCount: results.length, score }),
    );
    useResultStore.setState({ score });
    return score;
  }, []);

  /**
   * Fetches the top (highest) scores from the backend.
   */
  const getRegisteredScores = useCallback(async (limit = 10) => {
    const scores = await api.topScores(limit);
    return scores ?? [];
  }, []);

  const compareUserScores = useCallback(async (userScore: number) => {
    const res = await api.compareScore(userScore);

    // Scoring is higher-is-better: qualifies if it's in the top 10.
    return res.isTop10;
  }, []);

  /**
   * Retrieves both the calculated result and the current scores in parallel.
   */
  // TODO: getScore() is purely local, but a backend failure (e.g. 500) in
  // getRegisteredScores/compareUserScores currently throws and takes the
  // whole result down with it. Catch backend errors here so the local
  // score still reaches ResultSection and the user can keep playing even
  // when the score isn't registered.
  const getScoresForResultSection = useCallback(async () => {
    log.scores.debug("getScoresForResultSection START");
    const [result, topScores] = await Promise.all([
      getScore(),
      getRegisteredScores(10),
    ]);
    const compareResult = await compareUserScores(result);
    log.scores.debug(
      "getScoresForResultSection RESOLVED",
      JSON.stringify({
        result,
        topScoresCount: topScores.length,
        compareResult,
      }),
    );
    return { result, topScores, compareResult };
  }, [getScore, getRegisteredScores, compareUserScores]);

  return { getScore, getRegisteredScores, getScoresForResultSection };
}
