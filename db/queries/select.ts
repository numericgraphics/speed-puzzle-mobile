/*import { eq } from "drizzle-orm";

import { db } from "../index";
import { users } from "../schema";

export async function getUserByName(name: string) {
  const user = await db.query.users.findMany({
    where: (users, { eq }) => {
      return eq(users.userName, name);
    },
  });
  return user;
}

export async function getAllUsers() {
  const users = await db.query.users.findMany();
  return users;
}

export async function getAllScores() {
  const scores = await db.query.scores.findMany();
  return scores;
}

export async function getScoresByUserId(userId: number) {
  const scores = await db.query.scores.findMany({
    where: (scores, { eq }) => eq(scores.userId, userId),
  });
  return scores;
}
export async function getTopScores() {
  // Retrieve the highest‐value scores joined to their user
  const topScores = await db.query.scores.findMany({
    with: { user: true },
    orderBy: (scores, { desc }) => desc(scores.value),
    limit: 5,
  });

  // Map into an array of { name, score } objects
  return topScores.map(({ value, user }) => ({
    name: user.userName,
    score: value,
  }));
}
*/
