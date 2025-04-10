// TODO : use RSC// "use server";

import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PuzzleContainer from "@/modules/puzzle/puzzle-container-draggable";
import { useGame } from "@/providers/game";

export default function Puzzle() {
  const { getCurrentChallenge, isReady } = useGame();
  const currentChallenge = getCurrentChallenge();
  if (!isReady) {
    return (
      <View style={styles.rowItem}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!currentChallenge) {
    throw new Error("No current challenge available");
  }

  return (
    <PuzzleContainer
      image={currentChallenge.image}
      pieces={currentChallenge.pieces}
    />
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "yellow",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
