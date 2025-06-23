// StartScreenPuzzle.tsx (example with SharedValue)
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import RectangleLogo from "@/components/logo/rectangles";
import { useTheme } from "@/hooks/useTheme";
import { AnimatedRectangleLogo } from "@/components/logo/animated/container";
import {
  AnimatedRectanglesLayer,
  AnimatedRectanglesLayerHandle,
} from "@/components/logo/advanced-animated";

interface StartSessionProps {
  onStart: () => void;
}

export function StartSession({ onStart }: StartSessionProps) {
  const { styles, theme, isDark } = useTheme();
  const { containers, typography, buttons } = styles;
  const animationRef = useRef<AnimatedRectanglesLayerHandle>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationRef.current?.handleStartY();
    }, 1200);
    return () => clearTimeout(timeout);
    // animationRef.current.handleEndX();
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={containers.centeredFullScreen}
    >
      <View style={{ bottom: theme.spacer[5].y }}>
        {/* <AnimatedRectangleLogo
          width={50}
          height={50}
          color={isDark ? theme.color.white : theme.color.black}
        /> */}
        <AnimatedRectanglesLayer
          ref={animationRef}
          width={50}
          height={50}
          color={isDark ? theme.color.white : theme.color.black}
        />
      </View>
      {/* <RectangleLogo
        width={50}
        height={50}
        style={{ marginBottom: theme.spacer[4].y }}
        color={isDark ? theme.color.white : theme.color.black}
      /> */}
      <Text style={[typography.title, { paddingBottom: theme.spacer[1].y }]}>
        Welcome to the Puzzle Game !
      </Text>
      <Text style={[typography.body, { paddingBottom: theme.spacer[2].y }]}>
        Tap the button below to start the game.
      </Text>
      <Text
        style={[buttons.linkButton, { marginTop: theme.spacer[4].y }]}
        onPress={() => {
          // test !
          // onStart();
          animationRef.current?.handleEndX(() => onStart());
        }}
      >
        Start Game
      </Text>
    </Animated.View>
  );
}
