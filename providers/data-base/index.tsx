// providers/DatabaseProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import * as Network from "expo-network";

type DatabaseContextValue = {
  dbReady: boolean;
  resyncDB: () => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextValue | undefined>(
  undefined
);

// providers/data-base/index.tsx
export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = useSQLiteContext();
  const [dbReady] = useState(true); // guaranteed by onInit

  const resyncDB = async () => {
    try {
      await db.syncLibSQL?.();
      console.log("Manual DB sync ✔︎");
    } catch (e) {
      console.error("Manual DB sync ✖︎", e);
    }
  };

  return (
    <DatabaseContext.Provider value={{ dbReady, resyncDB }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextValue => {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error("useDatabase must be used within DatabaseProvider");
  return ctx;
};
