import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";

import { useEffect } from "react";

interface TimeDisplayProps {
  timerValue: number;
  completed: boolean;
}

function TimeDisplay({ completed, timerValue }: TimeDisplayProps) {
  const { styles } = useTheme();
  const { typography } = styles;
  // 1) Shared scale value
  const scale = useSharedValue(0);

  // 2) Derived opacity: stays 1 until scale hits 90% of 1.5 (i.e. 1.35), then fades to 0
  const opacity = useDerivedValue(() => {
    const startFade = 1.5 * 0.9; // = 1.35
    if (scale.value < startFade) return 1;
    const progress = (scale.value - startFade) / (1.5 - startFade);
    return 1 - progress;
  });

  // 3) Animated style combining scale + fade
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // 4) Trigger the timing when `completed` flips true
  useEffect(() => {
    if (completed) {
      scale.value = withTiming(1.5, { duration: 500 });
    } else {
      scale.value = withTiming(1, { duration: 500 });
    }
  }, [completed]);

  // Start ticking on mount; stop on unmount
  // useEffect(() => {
  //   console.log("isRunning", isRunning);
  //   if (!isRunning) start();
  // }, [isRunning]);

  // console.log("timerValue", timerValue);

  // return null;

  const totalMillis = timerValue;
  const totalSecs = Math.floor(totalMillis / 1000);
  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;
  const millis = totalMillis % 1000;

  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}.${millis
    .toString()
    .padStart(3, "0")}`;

  return (
    <Animated.View style={animatedStyle}>
      <Text style={typography.label}>{formatted}</Text>
    </Animated.View>
  );
}

export default TimeDisplay;
