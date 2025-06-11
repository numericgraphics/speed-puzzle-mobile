import { db } from "../index";

export async function isScoreInTop10(scoreValue: number): Promise<boolean> {
  const topScores = await db.query.scores.findMany({
    orderBy: (scores, { desc }) => desc(scores.value),
    limit: 10,
  });
  return topScores.some((score) => Number(score.value) === scoreValue);
}
