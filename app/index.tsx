import PuzzleContainer from "@/modules/puzzle/puzzle-container-draggable";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function HomeScreen() {
  return (
    <React.Suspense
      fallback={
        // The view that will render while the Server Function is awaiting data.
        <ActivityIndicator />
      }
    >
      <PuzzleContainer />
    </React.Suspense>
  );
}
