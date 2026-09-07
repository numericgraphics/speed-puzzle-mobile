// StartScreenPuzzle.tsx (example with SharedValue)
import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import {
  AnimatedRectanglesLayer,
  AnimatedRectanglesLayerHandle,
} from "@/components/logo/advanced-animated";
import { useRegistration } from "@/hooks/use-registration";
import { Link } from "expo-router";

interface StartSessionProps {
  onStart: () => void;
  gotoInformations: () => void;
}

export function StartSession({ onStart, gotoInformations }: StartSessionProps) {
  const { user, open } = useRegistration();
  const { styles, theme, isDark } = useTheme();
  const { containers, typography } = styles;
  const animationRef = useRef<AnimatedRectanglesLayerHandle>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationRef.current?.handleStartY();
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={containers.centeredFullScreen}
    >
      <View style={{ bottom: theme.spacer[5].y }}>
        <TouchableOpacity onPress={open}>
          <AnimatedRectanglesLayer
            ref={animationRef}
            width={50}
            height={50}
            color={isDark ? theme.color.white : theme.color.black}
          />
        </TouchableOpacity>
      </View>
      <Text style={[typography.title, { paddingBottom: theme.spacer[1].y }]}>
        {user ? `Welcome back ${user.userName}` : "Welcome to the Puzzle Game !"}
      </Text>
      <Text style={[typography.body, { paddingBottom: theme.spacer[2].y }]}>
        Tap the button below to start the game.
      </Text>
      <Button
        label="Start Game"
        icon="play"
        onPress={() => {
          animationRef.current?.handleEndX(() => onStart());
        }}
        style={{ marginTop: theme.spacer[4].y }}
      />
      <Button
        label="How to Play"
        icon="information-outline"
        onPress={() => gotoInformations()}
        style={{ marginTop: theme.spacer[1].y }}
      />
      <Text
        style={[typography.body, { opacity: 0.6, marginTop: theme.spacer[2].y }]}
      >
        Tap the logo to {user ? "manage your profile" : "sign up or log in"}
      </Text>
    </Animated.View>
  );
}
