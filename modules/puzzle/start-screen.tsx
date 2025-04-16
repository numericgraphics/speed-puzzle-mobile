// StartScreenPuzzle.tsx (example with SharedValue)
import React from "react";
import { Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import RectangleLogo from "@/components/logo/rectangles";
import { useTheme } from "@/hooks/useTheme";

interface StartScreenPuzzleProps {
  onStart: () => void;
}

export function StartPuzzle({ onStart }: StartScreenPuzzleProps) {
  const { styles, theme } = useTheme();
  console.log("StartPuzzle - styles", theme.spacer[8]);
  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <RectangleLogo
        width={50}
        height={50}
        style={{ marginBottom: theme.spacer[4].y }}
      />
      <Text style={styles.title}>Welcome to the Puzzle Game !</Text>
      <Text style={styles.text}>Tap the button below to start the game.</Text>
      <Text
        style={styles.linkButton}
        onPress={() => {
          onStart();
        }}
      >
        Start Game
      </Text>
    </Animated.View>
  );
}
