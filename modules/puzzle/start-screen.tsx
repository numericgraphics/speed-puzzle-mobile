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
  const { styles, theme, isDark } = useTheme();
  const { containers, typography, buttons } = styles;

  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={containers.centeredFullScreen}
    >
      <RectangleLogo
        width={50}
        height={50}
        style={{ marginBottom: theme.spacer[4].y }}
        color={isDark ? theme.color.white : theme.color.black}
      />
      <Text style={[typography.title, { paddingBottom: theme.spacer[1].y }]}>
        Welcome to the Puzzle Game !
      </Text>
      <Text style={[typography.body, { paddingBottom: theme.spacer[2].y }]}>
        Tap the button below to start the game.
      </Text>
      <Text
        style={[buttons.linkButton, { marginTop: theme.spacer[4].y }]}
        onPress={() => {
          onStart();
        }}
      >
        Start Game
      </Text>
    </Animated.View>
  );
}
