import { db } from "../index";
import { InsertScore, InsertUser, scores, users } from "../schema";

export async function getUserByName(name: string) {
  console.log("Getting user by name", name);
  const user = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.userName, name),
  });
  console.log("Got user by name", user);
  return user;
}
