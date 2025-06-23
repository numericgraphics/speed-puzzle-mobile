import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import {
  AnimatedRectanglesLayer,
  AnimatedRectanglesLayerHandle,
} from "@/components/logo/advanced-animated";

interface CompletedPuzzleProps {
  onRestart: () => void;
  score: number;
}

export function CompletedPuzzle({ onRestart, score }: CompletedPuzzleProps) {
  const { styles, theme, isDark } = useTheme();
  const { containers, typography, buttons } = styles;
  const animationRef = useRef<AnimatedRectanglesLayerHandle>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationRef.current?.handleStartY();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={containers.centeredFullScreen}
    >
      <View style={{ bottom: theme.spacer[5].y }}>
        <AnimatedRectanglesLayer
          ref={animationRef}
          width={50}
          height={50}
          color={isDark ? theme.color.white : theme.color.black}
        />
      </View>
      <Text style={[typography.title, { paddingBottom: theme.spacer[1].y }]}>
        Congrats, you finished the game !
      </Text>
      <Text style={[typography.body, { paddingBottom: theme.spacer[2].y }]}>
        Your final score:
      </Text>
      <Text
        style={[
          typography.title,
          {
            fontSize: 48,
            fontWeight: "bold",
            paddingBottom: theme.spacer[3].y,
          },
        ]}
      >
        {score}
      </Text>
      <Text
        style={[buttons.linkButton, { marginTop: theme.spacer[4].y }]}
        onPress={() => {
          animationRef.current?.handleEndX(() => onRestart());
        }}
      >
        Play again !
      </Text>
    </Animated.View>
  );
}
