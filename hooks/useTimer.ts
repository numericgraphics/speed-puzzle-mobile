import { useEffect, useRef, useState, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInSeconds } from "date-fns";

const STORAGE_KEY = "@start_time";

export const useElapsedTimer = () => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);

  const getElapsedTime = useCallback(async (): Promise<number> => {
    try {
      const storedStartTime = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedStartTime) return 0;

      const parsedStart = new Date(storedStartTime);
      if (isNaN(parsedStart.getTime())) return 0;

      const now = new Date();
      return differenceInSeconds(now, parsedStart);
    } catch (err) {
      console.warn("Failed to get elapsed time:", err);
      return 0;
    }
  }, []);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const newElapsed = await getElapsedTime();
        setElapsed(newElapsed);
      }
      appState.current = nextAppState;
    },
    [getElapsedTime]
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [handleAppStateChange]);

  const startTimer = useCallback(async () => {
    const alreadyStarted = await AsyncStorage.getItem(STORAGE_KEY);
    if (!alreadyStarted) {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEY, now);
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(async () => {
        const currentElapsed = await getElapsedTime();
        setElapsed(currentElapsed);
      }, 1000);
    }
  }, [getElapsedTime]);

  const stopTimer = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const finalElapsed = await getElapsedTime();
    setElapsed(finalElapsed);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, [getElapsedTime]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsed(0);
  }, []);

  // Load saved timer on mount
  useEffect(() => {
    getElapsedTime().then(setElapsed);
  }, [getElapsedTime]);

  return {
    elapsed,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
