import React from "react";
import { Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import RectangleLogo from "@/components/logo/rectangles";
import { useTheme } from "@/hooks/useTheme";

interface CompletedPuzzleProps {
  onRestart: () => void;
}

export function CompletedPuzzle({ onRestart }: CompletedPuzzleProps) {
  const { styles, theme } = useTheme();
  const { containers, typography, buttons } = styles;
  return (
    <Animated.View
      entering={FadeIn.duration(300)} // Optional: customize duration
      exiting={FadeOut.duration(300)}
      style={containers.centeredFullScreen}
    >
      <RectangleLogo
        width={50}
        height={50}
        style={{ marginBottom: theme.spacer[4].y }}
      />
      <Text style={[typography.title, { paddingBottom: theme.spacer[1].y }]}>
        Congrats, you finished the game !
      </Text>
      <Text style={[typography.body, { paddingBottom: theme.spacer[2].y }]}>
        You could display a final score or share options, etc.
      </Text>
      <Text
        style={[buttons.linkButton, { marginTop: theme.spacer[4].y }]}
        onPress={() => {
          onRestart();
        }}
      >
        Start Game
      </Text>
    </Animated.View>
  );
}
