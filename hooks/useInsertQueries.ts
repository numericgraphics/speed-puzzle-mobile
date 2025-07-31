import { Score, User } from "@/db/schema";
import { useSQLiteContext } from "expo-sqlite";

// Access the DB via React Context (Expo docs recommendation)
export function useInsertQueries() {
  const db = useSQLiteContext();

  async function createUser(data: { userName: string; password: string }) {
    const { userName, password } = data;
    await db.runAsync(
      "INSERT INTO users (user_name, password) VALUES (?, ?)",
      userName,
      password
    );
  }

  async function createScore(data: { value: number; userId?: number | null }) {
    const { value, userId } = data;
    await db.runAsync(
      "INSERT INTO scores (value, user_id) VALUES (?, ?)",
      value,
      userId ?? null
    );
  }

  return { createUser, createScore };
}
