// CompletedPuzzle.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface CompletedPuzzleProps {
  onRestart: () => void;
}

export function CompletedPuzzle({ onRestart }: CompletedPuzzleProps) {
  return (
    <Animated.View
      // Use the Reanimated View with fade-in and fade-out transitions
      entering={FadeIn.duration(300)} // Optional: customize duration
      exiting={FadeOut.duration(300)}
      style={styles.rowItem}
    >
      <Text style={styles.title}>Congrats, you finished the game!</Text>
      <Text style={styles.text}>
        You could display a final score or share options, etc.
      </Text>
      <Button title="Start Again" onPress={onRestart} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowItem: {
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
