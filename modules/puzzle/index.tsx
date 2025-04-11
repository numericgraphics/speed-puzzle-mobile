// TODO : use RSC// "use server";

import React, { useEffect } from "react";
import { useUnsplashStore, useUnsplashStoreActions } from "@/stores/unsplash";
import { useGameStore, useGameStoreActions } from "@/stores/game";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PuzzleContainer from "@/modules/puzzle/puzzle-container-draggable";
import { StatusMessage } from "@/components/message-display";

export default function Puzzle() {
  // Store slices
  const { images, loading, error } = useUnsplashStore();
  const { isReady, completed } = useGameStore();
  // Store actions
  const { fetchImages } = useUnsplashStoreActions();
  const { buildChallenges, nextChallenge, getCurrentChallenge } =
    useGameStoreActions();
  const currentChallenge = getCurrentChallenge();

  // On mount, fetch images
  useEffect(() => {
    fetchImages("forest", 10);
  }, []);

  // Once images are fetched, build the challenges
  useEffect(() => {
    if (!loading && images.length > 0) {
      console.log("BUILD CHALLENGES! Images fetched");
      buildChallenges();
    }
  }, [loading, images, buildChallenges]);

  useEffect(() => {
    if (currentChallenge && currentChallenge?.completed) {
      nextChallenge();
    }
  }, [currentChallenge, nextChallenge]);

  // Listen for the end-of-game
  useEffect(() => {
    if (completed) {
      console.log(
        "GAME COMPLETE! You could show a final score here or navigate away."
      );
      // e.g., navigate('/results') or set some "show end screen" state
    }
  }, [completed]);

  if (loading) {
    return <StatusMessage message="Loading..." />;
  }

  if (error) {
    return <StatusMessage message={`Error: ${error}`} />;
  }

  if (!isReady) {
    return <StatusMessage message="Please wait, building the game..." />;
  }

  if (completed) {
    return (
      <View style={styles.rowItem}>
        <Text style={styles.title}>Congrats, you finished the game!</Text>
        <Text style={styles.text}>
          You could display a final score or share options, etc.
        </Text>
      </View>
    );
  }

  return (
    <PuzzleContainer
      image={currentChallenge.image}
      pieces={currentChallenge.pieces}
    />
  );
}

/*
import { useGame } from "@/providers/game";
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

  */

const styles = StyleSheet.create({
  rowItem: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "red",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "regular",
    textAlign: "center",
  },
});
