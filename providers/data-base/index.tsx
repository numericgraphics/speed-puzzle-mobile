// providers/DatabaseProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as Network from "expo-network";
import { DB_NAME } from "@/constants";

type DatabaseContextValue = {
  dbReady: boolean;
  resyncDB: () => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextValue | undefined>(
  undefined
);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dbReady, setDbReady] = useState(false);
  const db = useSQLiteContext();

  const shouldResetReplica = (err: unknown) => {
    const msg = String((err as any)?.message ?? err ?? "");
    return (
      msg.includes("higher frame_no") ||
      msg.toLowerCase().includes("generation") ||
      msg.includes("InvalidPushFrameConflict") ||
      msg.includes("InvalidGeneration")
    );
  };

  const resetLocalReplica = useCallback(async () => {
    try {
      // Close DB before deleting (if the platform supports it)
      await (db as any)?.closeAsync?.();
    } catch {
      // no-op
    }
    try {
      await SQLite.deleteDatabaseAsync(DB_NAME);
      console.log("Deleted local replica:", DB_NAME);
    } catch (e) {
      console.error("Failed to delete local replica:", e);
    }
  }, [db]);

  const synchronizeDatabase = useCallback(async () => {
    try {
      const { isConnected } = await Network.getNetworkStateAsync();
      if (!isConnected) {
        console.log("No network connection. Skipping sync.");
        return;
      }

      // Try normal sync first
      await db.syncLibSQL();
      console.log("Database sync completed successfully.");
      setDbReady(true);
    } catch (error) {
      console.error("Error during database sync:", error);

      if (shouldResetReplica(error)) {
        // Re-bootstrap the local replica from the server snapshot
        await resetLocalReplica();
        setDbReady(false);
        setTimeout(() => {
          synchronizeDatabase().catch((e) =>
            console.error("Retry sync failed:", e)
          );
        }, 0);
      } else {
        setDbReady(false);
      }
    }
  }, [db, resetLocalReplica]);

  useEffect(() => {
    if (!dbReady) {
      console.log("synchronizeDatabase called on mount");
      synchronizeDatabase();
    }
  }, [dbReady, synchronizeDatabase]);

  const resyncDB = useCallback(async () => {
    setDbReady(false);
    try {
      await db.syncLibSQL();
      console.log("Manual database re-sync successful.");
      setDbReady(true);
    } catch (error) {
      console.error("Database re-sync failed:", error);
      if (shouldResetReplica(error)) {
        await resetLocalReplica();
        setDbReady(false);
        await synchronizeDatabase();
      } else {
        setDbReady(false);
      }
    }
  }, [db, resetLocalReplica, synchronizeDatabase]);

  return (
    <DatabaseContext.Provider value={{ dbReady, resyncDB }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextValue => {
  const ctx = useContext(DatabaseContext);
  if (!ctx)
    throw new Error("useDatabase must be used within a DatabaseProvider");
  return ctx;
};
