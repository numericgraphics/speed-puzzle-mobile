// TODO : use RSC
// "use server";
// return (
//   <React.Suspense
//     fallback={
//       <ActivityIndicator />
//     }
//   >
//     <PuzzleContainer />
//   </React.Suspense>
// );

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

  const url = currentChallenge.image.url;
  return <PuzzleContainer url={url} />;
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
