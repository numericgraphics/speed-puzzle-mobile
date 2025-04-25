import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInMilliseconds } from "date-fns";

const STORAGE_KEY = "@start_time";

class ElapsedTimer {
  private intervalRef: NodeJS.Timeout | null = null;
  private elapsed: number = 0; // added to keep track of elapsed time internally

  async getElapsedTime(): Promise<number> {
    try {
      const storedStartTime = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedStartTime) return 0;

      const parsedStart = new Date(storedStartTime);
      if (isNaN(parsedStart.getTime())) return 0;

      const now = new Date();
      this.elapsed = differenceInMilliseconds(now, parsedStart);
      return this.elapsed;
    } catch (err) {
      console.warn("Failed to get elapsed time:", err);
      return 0;
    }
  }

  get currentElapsed(): number {
    return this.elapsed;
  }

  async start(): Promise<void> {
    const alreadyStarted = await AsyncStorage.getItem(STORAGE_KEY);
    if (!alreadyStarted) {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEY, now);
    }
  }

  async stop(): Promise<number> {
    const elapsed = await this.getElapsedTime();
    await AsyncStorage.removeItem(STORAGE_KEY);
    this.clearInterval();
    return elapsed;
  }

  reset(): void {
    this.elapsed = 0;
    this.clearInterval();
    AsyncStorage.removeItem(STORAGE_KEY).catch((err) => {
      console.warn("Failed to reset timer:", err);
    });
  }

  clearInterval(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  }

  subscribe(callback: (elapsed: number) => void, interval = 1000): void {
    this.clearInterval();
    this.intervalRef = setInterval(async () => {
      const elapsed = await this.getElapsedTime();
      callback(elapsed);
    }, interval);
  }

  unsubscribe(): void {
    this.clearInterval();
  }
}

export default new ElapsedTimer();
