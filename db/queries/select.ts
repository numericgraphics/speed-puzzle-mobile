import { db } from "../index";

export async function getUserByName(name: string) {
  const user = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.userName, name),
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
