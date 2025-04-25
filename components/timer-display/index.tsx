import { Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import {
  useTimerActions,
  useTimerRunning,
  useTimerStore,
  useTimerValue,
} from "@/stores/timer";
import { useEffect } from "react";

function TimeDisplay() {
  const { styles } = useTheme();
  const { typography } = styles;
  const timerValue = useTimerValue();
  const isRunning = useTimerRunning();

  // Start ticking on mount; stop on unmount
  // useEffect(() => {
  //   console.log("isRunning", isRunning);
  //   if (!isRunning) start();
  // }, [isRunning]);

  console.log("timerValue", timerValue);

  // return null;

  const totalMillis = timerValue;
  const totalSecs = Math.floor(totalMillis / 1000);
  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;
  const millis = totalMillis % 1000;

  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}.${millis
    .toString()
    .padStart(3, "0")}`;

  return <Text style={typography.label}>{formatted}</Text>;
}

export default TimeDisplay;
