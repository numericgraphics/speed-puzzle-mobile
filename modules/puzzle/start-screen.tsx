// StartScreenPuzzle.tsx (example with SharedValue)
import RectangleLogo from "@/components/logo/rectangles";
import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

interface StartScreenPuzzleProps {
  onStart: () => void;
}

export function StartPuzzle({ onStart }: StartScreenPuzzleProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(1500)} // Optional: customize duration
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <RectangleLogo width={50} height={50} style={{ marginBottom: 50 }} />
      <Text style={styles.title}>Welcome to the Puzzle Game!</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10,
  },
  text: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 10,
  },
  linkButton: {
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    padding: 8,
    marginTop: 20,
    borderRadius: 4,
  },
});
