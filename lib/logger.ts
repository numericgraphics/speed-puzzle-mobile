// lib/logger.ts
import { consoleTransport, logger } from "react-native-logs";

/** Zones map to app domains so logs can be traced back to their area. */
const ZONES = ["api", "game", "timer", "puzzle", "scores", "ui"] as const;
type Zone = (typeof ZONES)[number];

const config = {
  severity: __DEV__ ? "debug" : "warn",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      debug: "grey",
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    } as const,
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: false,
  enabled: true,
} as const;

const root = logger.createLogger(config);

export const log = ZONES.reduce(
  (acc, zone) => {
    acc[zone] = root.extend(zone);
    return acc;
  },
  {} as Record<Zone, ReturnType<typeof root.extend>>,
);
