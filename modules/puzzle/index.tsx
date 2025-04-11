// TODO : use RSC// "use server";

import React, { useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

import { useUnsplashStore, useUnsplashStoreActions } from "@/stores/unsplash";
import { useGameStore, useGameStoreActions } from "@/stores/game";
import PuzzleContainer from "@/modules/puzzle/puzzle-container-draggable";
import { StatusMessage } from "@/components/message-display";

export default function Puzzle() {
  // Store slices
  const { images, loading, error } = useUnsplashStore();
  const { isReady, completed } = useGameStore();
  // Store actions
  const { fetchImages } = useUnsplashStoreActions();
  const { buildChallenges, nextChallenge, getCurrentChallenge, resetGame } =
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
        <Button
          title="Start Again"
          onPress={() => {
            // Reset the game state and rebuild a new puzzle set
            resetGame();
            buildChallenges();
          }}
        />
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

const styles = StyleSheet.create({
  rowItem: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
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
    fontWeight: "regular",
    textAlign: "center",
  },
});
