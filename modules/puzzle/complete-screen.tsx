// CompletedPuzzle.tsx
import RectangleLogo from "@/components/logo/rectangles";
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
      style={styles.container}
    >
      <RectangleLogo width={50} height={50} style={{ marginBottom: 50 }} />
      <Text style={styles.title}>Congrats, you finished the game!</Text>
      <Text style={styles.text}>
        You could display a final score or share options, etc.
      </Text>
      <Text
        style={styles.linkButton}
        onPress={() => {
          onRestart();
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
