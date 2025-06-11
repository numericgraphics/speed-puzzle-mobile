import { db } from "../index";

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
  const scores = await db.query.scores.findMany({
    orderBy: (scores, { desc }) => desc(scores.value),
    limit: 5,
  });
  return scores;
}
