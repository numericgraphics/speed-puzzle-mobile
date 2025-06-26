// providers/DatabaseProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite"; // assume expo-sqlite is installed
import * as Network from "expo-network"; // (optional, for offline check)

type DatabaseContextValue = {
  dbReady: boolean;
  resyncDB: () => Promise<void>; // function to re-trigger sync
};

// Create the context with a default undefined value
const DatabaseContext = createContext<DatabaseContextValue | undefined>(
  undefined
);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dbReady, setDbReady] = useState(false);
  const db = useSQLiteContext(); // open or get the database instance

  // Define the sync function (could also be defined outside)
  const synchronizeDatabase = async () => {
    try {
      // (Optional) Check network status for offline-friendly handling
      const { isConnected } = await Network.getNetworkStateAsync();
      if (!isConnected) {
        console.log("No network connection. Skipping sync.");
        // If offline, you might choose to set dbReady true to allow offline use of local DB:
        // setDbReady(true);
        return; // Skip calling syncLibSQL if offline
      }
      // Perform the sync with remote libSQL server (returns a Promise<void>)
      await db.syncLibSQL();
      console.log("Database sync completed successfully.");
      setDbReady(true);
    } catch (error) {
      console.error("Error during database sync:", error);
      // Keep dbReady false on failure, since sync didn't complete
      setDbReady(false);
    }
  };

  // Run sync on initial mount
  useEffect(() => {
    console.log("synchronizeDatabase called on mount");
    if (!db) {
      console.error("Database instance is null. Cannot synchronize.");
      return;
    }
    if (!dbReady) {
      synchronizeDatabase();
    }
  }, [db, dbReady]);

  // Provide a manual re-sync function
  const resyncDB = async (): Promise<void> => {
    setDbReady(false); // reset flag (database not ready during re-sync)
    try {
      await db.syncLibSQL();
      console.log("Manual database re-sync successful.");
      setDbReady(true);
    } catch (error) {
      console.error("Database re-sync failed:", error);
      setDbReady(false);
    }
  };

  return (
    <DatabaseContext.Provider value={{ dbReady, resyncDB }}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook for consuming the context
export const useDatabase = (): DatabaseContextValue => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
