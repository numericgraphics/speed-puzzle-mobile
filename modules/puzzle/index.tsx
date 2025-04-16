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
  const { loading, completed, challenges } = useGameStore();
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

  const onStartGame = () => {
    console.log("STARTING GAME!");
    startGame();
  };
  const onRestartGame = () => {
    console.log("RESTARTING GAME!");
    resetGame();
    startGame();
  };

  // On mount, fetch images
  useEffect(() => {
    if (started) {
      fetchImages("forest", 10);
    }
  }, [started]);

  // Once images are fetched, build the challenges
  useEffect(() => {
    if (images.length > 0) {
      console.log("BUILD CHALLENGES! Images fetched");
      buildChallenges();
    }
  }, [loading, images, buildChallenges]);

  useEffect(() => {
    if (currentChallenge?.completed && needNextChallenge) {
      console.log("NEXT CHALLENGE! ", currentChallenge);
      nextChallenge();
    }
  }, [currentChallenge, nextChallenge, needNextChallenge]);

  // Listen for the end-of-game
  useEffect(() => {
    if (completed) {
      console.log(
        "GAME COMPLETE! You could show a final score here or navigate away.",
        challenges
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
    return <StartPuzzle onStart={onStartGame} />;
  }

  if (completed) {
    return <CompletedPuzzle onRestart={onRestartGame} />;
  }

  return (
    <PuzzleContainer
      image={currentChallenge?.image}
      pieces={currentChallenge?.pieces}
    />
  );
}
