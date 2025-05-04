import { create } from "zustand";
import { devtools } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface TimerActions {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export interface TimerState {
  /** Elapsed time in milliseconds */
  timerValue: number;
  /** True while the interval is running */
  running: boolean;
  /** Helper methods (same pattern as useGameStore) */
  actions: TimerActions;
}

/* ------------------------------------------------------------------ */
/*  Default state (exported so you can reuse it elsewhere)            */
/* ------------------------------------------------------------------ */

export const initialTimerState = {
  timerValue: 0,
  running: false,
};

/* ------------------------------------------------------------------ */
/*  Store                                                             */
/* ------------------------------------------------------------------ */

export const useTimerStore = create<TimerState>()(
  devtools(
    (set, get) => {
      /* intervalId is kept outside Zustand state but shared across calls */
      let intervalId: ReturnType<typeof setInterval> | null = null;

      /* -------- helpers in one place -------------------------------- */
      const actions: TimerActions = {
        start() {
          if (get().running) return;

          // Resume from the current value if restarting
          const origin = Date.now() - get().timerValue;

          intervalId = setInterval(() => {
            set({ timerValue: Date.now() - origin });
            // console.log("interval", Date.now() - origin);
          }, 10); // ~33 fps

          set({ running: true });
        },

        stop() {
          console.log("useTimerStore stop - intervalId", intervalId);
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          set({ running: false });
        },

        reset() {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          set({ timerValue: 0, running: false });
        },
      };

      /* -------- store shape ----------------------------------------- */
      return {
        ...initialTimerState,
        actions,
      };
    },
    { name: "timer-store" }
  )
);

/* ------------------------------------------------------------------ */
/*  Selectors                                                         */
/* ------------------------------------------------------------------ */

export const useTimerValue = () => useTimerStore((s) => s.timerValue);
export const useTimerRunning = () => useTimerStore((s) => s.running);
export const useTimerActions = () => useTimerStore((s) => s.actions);
