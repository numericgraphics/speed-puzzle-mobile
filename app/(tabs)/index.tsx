import fetchPuzzle from "@/actions/fetch-puzzle";
import Puzzle from "@/actions/fetch-puzzle";
import React, { lazy } from "react";

import { ActivityIndicator } from "react-native";

export default function HomeScreen() {
  return (
    <React.Suspense
      fallback={
        // The view that will render while the Server Function is awaiting data.
        <ActivityIndicator />
      }
    >
      {fetchPuzzle()}
    </React.Suspense>
  );
}
