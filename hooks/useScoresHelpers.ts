import { useSQLiteContext } from "expo-sqlite";

/**
 * Score-related helpers using Expo SQLite's context API.
 * Use inside components/hooks that are descendants of <SQLiteProvider>.
 */
export function useScoresHelpers() {
  const db = useSQLiteContext();

  /**
   * Returns true if `scoreValue` appears among the values of the top 10 rows
   * (ordered by value DESC). This preserves the original semantics: membership
   * in the top-10 list, not rank-based thresholding.
   *
   * Runs as a single SQL query (no client-side filtering).
   */
  async function isScoreInTop10(scoreValue: number): Promise<boolean> {
    const row = await db.getFirstAsync(
      `SELECT 1 AS present
       FROM (
         SELECT value
         FROM scores
         ORDER BY value DESC
         LIMIT 10
       ) t
       WHERE t.value = ?
       LIMIT 1`,
      scoreValue
    );
    return !!row;
  }

  /**
   * Generalized check against the top-N rows.
   */
  async function isScoreInTopN(
    scoreValue: number,
    n: number
  ): Promise<boolean> {
    const row = await db.getFirstAsync(
      `SELECT 1 AS present
       FROM (
         SELECT value
         FROM scores
         ORDER BY value DESC
         LIMIT ?
       ) t
       WHERE t.value = ?
       LIMIT 1`,
      n,
      scoreValue
    );
    return !!row;
  }

  return { isScoreInTop10, isScoreInTopN };
}
