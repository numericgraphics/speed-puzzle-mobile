import * as Network from "expo-network";
import type { SQLiteDatabase } from "expo-sqlite";

/** One-shot bootstrap called by <SQLiteProvider onInit={initDb}> */
export async function initDb(db: SQLiteDatabase): Promise<void> {
  // Example migration (keep idempotent!)
  // await db.execAsync(`CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY, value INTEGER);`);

  try {
    const { isConnected } = await Network.getNetworkStateAsync();
    if (!isConnected) {
      console.log("Offline – skipping remote sync");
      return;
    }

    await db.syncLibSQL();
    console.log("DB syncLibSQL done");
    // if (typeof (db as any).syncLibSQL === "function") {
    //   await (db as any).syncLibSQL();
    //   console.log("DB sync ✔︎");
    // }
  } catch (e) {
    console.error("DB sync ✖︎", e);
  }
}
