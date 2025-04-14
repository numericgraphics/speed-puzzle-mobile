// TODO : use RSC// "use server";

import React, { useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

import { useUnsplashStore, useUnsplashStoreActions } from "@/stores/unsplash";
import {
  useGameStore,
  useGameStoreActions,
  useNeedNextChallenge,
  useStarted,
} from "@/stores/game";
import PuzzleContainer from "@/modules/puzzle/puzzle-container-draggable";
import { StatusMessage } from "@/components/message-display";
import { CompletedPuzzle } from "./complete-screen";
import { StartPuzzle } from "./start-screen";

export default function Puzzle() {
  // Store slices
  const { images, error } = useUnsplashStore();
  const { loading, completed } = useGameStore();
  // Store actions
  const { fetchImages } = useUnsplashStoreActions();
  const {
    buildChallenges,
    getCurrentChallenge,
    resetGame,
    nextChallenge,
    startGame,
  } = useGameStoreActions();
  const needNextChallenge = useNeedNextChallenge();
  const currentChallenge = getCurrentChallenge();
  const started = useStarted();

  // On mount, fetch images
  useEffect(() => {
    console.log("STARTED CHALLENGES! fetch images ", started);
    if (started) {
      fetchImages("forest", 10);
    }
  }, [started]);

  // Once images are fetched, build the challenges
  useEffect(() => {
    console.log("BUILD CHALLENGES! fetch images ", images);
    if (images.length > 0) {
      console.log("BUILD CHALLENGES! Images fetched");
      buildChallenges();
    }
  }, [loading, images, buildChallenges]);

  useEffect(() => {
    if (currentChallenge?.completed && needNextChallenge) {
      nextChallenge();
    }
  }, [currentChallenge, nextChallenge, needNextChallenge]);

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

  if (!started) {
    return (
      <StartPuzzle
        onStart={() => {
          startGame();
        }}
      />
    );
  }

  if (completed) {
    return (
      <CompletedPuzzle
        onRestart={() => {
          resetGame();
          startGame();
        }}
      />
    );
  }

  return (
    <PuzzleContainer
      image={currentChallenge?.image}
      pieces={currentChallenge?.pieces}
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
    paddingBottom: 10,
  },
});
