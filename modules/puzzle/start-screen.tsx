// StartScreenPuzzle.tsx (example with SharedValue)
import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface StartScreenPuzzleProps {
  onStart: () => void;
}

export function StartPuzzle({ onStart }: StartScreenPuzzleProps) {
  // 1) Create shared values for opacity and vertical position (translateY).
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50); // start off slightly below (or above, if negative)

  // 2) Kick off the animation when the component mounts
  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [opacity, translateY]);

  // 3) Map shared values to styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>Welcome to the Puzzle Game!</Text>
      <Text style={styles.text}>Tap the button below to start the game.</Text>
      <Button title="Start Game" onPress={onStart} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "black",
  },
  title: {
    color: "red",
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
});
