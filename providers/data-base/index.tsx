// speed-puzzle-mobile/providers/data-base/index.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Network from "expo-network";
import { Api } from "../../lib/api";

export type DatabaseContextValue = {
  api: Api;
  isConnected: boolean | null;
  ready: boolean; // true after the initial connectivity + health check
  lastHealth?: unknown; // value returned by /__debug if reachable
};

const DatabaseContext = createContext<DatabaseContextValue | undefined>(
  undefined
);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [lastHealth, setLastHealth] = useState<unknown>(undefined);

  // Single Api instance; resolves baseURL from EXPO_PUBLIC_API_URL or sensible fallbacks
  const api = useMemo(() => new Api(), []);

  useEffect(() => {
    (async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsConnected(state.isConnected ?? null);

        if (state.isConnected) {
          const health = await api.health();
          setLastHealth(health);
          console.log("[DatabaseProvider] Backend reachable. Health:", health);
        } else {
          console.warn("[DatabaseProvider] No network connection");
        }
      } catch (err) {
        console.warn(
          "[DatabaseProvider] Backend not reachable:",
          (err as Error).message
        );
      } finally {
        setReady(true);
      }
    })();
  }, [api]);

  return (
    <DatabaseContext.Provider value={{ api, isConnected, ready, lastHealth }}>
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
