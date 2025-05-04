// /stores/timer.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const now = () =>
  typeof performance !== "undefined" && performance.now
    ? performance.now() // sub‑millisecond in browsers / React Native
    : Date.now(); // graceful fallback (ms resolution)

interface TimerState {
  /** Timestamp of the current run (null when paused) */
  startTime: number | null;
  /** Total elapsed time accumulated over all runs (ms) */
  elapsed: number;
  /** Is the timer actively counting? */
  running: boolean;
  /** Public API */
  actions: {
    start: () => void;
    stop: () => number;
    reset: () => void;
    getTimeValue: () => number;
  };
}

export const useElaspedTimerStore = create<TimerState>()(
  devtools((set, get) => ({
    startTime: null,
    elapsed: 0,
    running: false,

    actions: {
      /** Begin (or resume) counting */
      start() {
        const { running } = get();
        if (!running) {
          set({ startTime: now(), running: true });
        }
      },

      /** Pause and return the total elapsed time */
      stop() {
        const { startTime, elapsed, running } = get();
        if (!running || startTime === null) return elapsed;
        const delta = now() - startTime;
        const total = elapsed + delta;
        set({ elapsed: total, startTime: null, running: false });
        return total;
      },

      /** Reset to zero (whether running or not) */
      reset() {
        set({ startTime: null, elapsed: 0, running: false });
      },

      /** Current elapsed time without mutating state */
      getValue() {
        const { startTime, elapsed, running } = get();
        return running && startTime !== null
          ? elapsed + (now() - startTime)
          : elapsed;
      },
    },
  }))
);

/* ------------------------------------------------------------------ */
/* Optional handy hooks so components don’t have to dig into the store */
/* ------------------------------------------------------------------ */

export const useTimerActions = () => useElaspedTimerStore((s) => s.actions);
/** Reactively read the running flag */
export const useTimerRunning = () => useElaspedTimerStore((s) => s.running);
/** Reactively read the *display* value (updates every render) */
export const useElapsedValue = () => {
  // Because getTimeValue is pure, it can safely be called each render.
  const getTimeValue = useElaspedTimerStore((s) => s.actions.getTimeValue);
  return getTimeValue();
};
