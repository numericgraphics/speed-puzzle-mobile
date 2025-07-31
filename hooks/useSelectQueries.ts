import { User } from "@/db/schema";
import { useSQLiteContext } from "expo-sqlite";

// Access the DB via React Context (Expo docs recommendation)
// Wrap your app with <SQLiteProvider> (already done in app/_layout.tsx),
// then call these helpers inside components/hooks.
export function useSelectQueries() {
  const db = useSQLiteContext();

  async function getUserByName(name: string): Promise<User[]> {
    const rows = await db.getAllAsync(
      "SELECT * FROM users WHERE user_name = ?",
      name
    );
    return rows as User[];
  }

  async function getAllUsers(): Promise<User[]> {
    const rows = await db.getAllAsync("SELECT * FROM users");
    return rows as User[];
  }

  async function getAllScores(): Promise<any[]> {
    const rows = await db.getAllAsync("SELECT * FROM scores");
    return rows;
  }

  async function getScoresByUserId(userId: number): Promise<any[]> {
    const rows = await db.getAllAsync(
      "SELECT * FROM scores WHERE user_id = ?",
      userId
    );
    return rows;
  }

  async function getTopScores() {
    const rows = await db.getAllAsync(
      `SELECT u.user_name AS name, s.value AS score
       FROM scores s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.value DESC
       LIMIT 5`
    );
    return rows as Array<{ name: string; score: number }>;
  }

  return {
    getUserByName,
    getAllUsers,
    getAllScores,
    getScoresByUserId,
    getTopScores,
  };
}
