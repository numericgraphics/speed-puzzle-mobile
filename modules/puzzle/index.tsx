// TODO : use RSC// "use server";

import React, { useEffect } from "react";

import { useUnsplashStore, useUnsplashStoreActions } from "@/stores/unsplash";
import {
  useGameStore,
  useGameStoreActions,
  useNeedNextChallenge,
  useGameStoreStarted,
  useGameStoreStartTimer,
} from "@/stores/game";
import PuzzleContainer from "@/modules/puzzle/puzzle-container";
import PuzzleContainerVertical from "@/modules/puzzle/puzzle-vertical-container";
import { StatusMessage } from "@/components/message-display";
import { CompletedPuzzle } from "./complete-screen";
import { StartPuzzle } from "./start-screen";
import { useTimerActions, useTimerStore } from "@/stores/timer";
import { NUMBER_OF_QUESTION } from "@/constants";
import { fetchUnsplashImage } from "@/helpers/unsplash-photo";

export default function Puzzle() {
  // Store slices
  const { images, error, imageReady } = useUnsplashStore();
  const { loading, completed, challenges } = useGameStore();
  // Store actions
  const { fetchImages, resetImages } = useUnsplashStoreActions();
  const {
    buildChallenges,
    getCurrentChallenge,
    restartGame,
    nextChallenge,
    startGame,
    getScore,
  } = useGameStoreActions();
  const needNextChallenge = useNeedNextChallenge();
  const currentChallenge = getCurrentChallenge();
  const started = useGameStoreStarted();
  const timerAction = useTimerActions();
  const startTimer = useGameStoreStartTimer();
  const { actions: timerActions } = useTimerStore.getState();

  const onStartGame = () => {
    console.log("STARTING GAME!");
    startGame();
  };
  // Re-initialize the game state, with empty challenges
  const onRestartGame = () => {
    console.log("RESTARTING GAME!");
    restartGame();
  };

  // On mount, fetch images
  useEffect(() => {
    const getImages = async () => {
      try {
        useUnsplashStore.setState({ loading: true });
        const unsplashImages = await fetchUnsplashImage(
          NUMBER_OF_QUESTION,
          false
        );
        fetchImages(unsplashImages);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    console.log("FETCH IMAGES!", images);
    if (images.length === 0 && loading) {
      getImages();
    }
  }, [images, loading]);

  useEffect(() => {
    if (startTimer) {
      console.log("START TIMER");
      timerAction.start();
    } else {
      console.log("RESET TIMER");
      timerAction.reset();
    }
  }, [startTimer]);

  useEffect(() => {
    console.log("BUILD CHALLENGES!", imageReady);
    if (imageReady) {
      console.log("BUILD CHALLENGES! Images fetched");
      buildChallenges();
    }
  }, [imageReady, buildChallenges]);

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
        getScore()
      );
      timerActions.reset();
      resetImages();
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
    return <CompletedPuzzle onRestart={onRestartGame} score={getScore()} />;
  }

  return (
    <>
      {currentChallenge?.isVertical ? (
        <PuzzleContainerVertical
          image={currentChallenge?.image}
          pieces={currentChallenge?.pieces}
        />
      ) : (
        <PuzzleContainer
          image={currentChallenge?.image}
          pieces={currentChallenge?.pieces}
        />
      )}
    </>
  );
}
