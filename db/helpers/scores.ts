// db/helpers/scores.ts
import { desc } from "drizzle-orm";
import { db } from "../index";
import { scores } from "../schema";

/**
 * Returns true if `scoreValue` appears among the top 10 scores.
 * Mirrors the select.ts style: select → from → orderBy → limit.
 */
export async function isScoreInTop10(scoreValue: number): Promise<boolean> {
  const top = await db
    .select({ value: scores.value })
    .from(scores)
    .orderBy(desc(scores.value))
    .limit(10);

  return top.some((row) => Number(row.value) === scoreValue);
}
