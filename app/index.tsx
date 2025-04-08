import PuzzleContainer from "@/modules/puzzle";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function Page() {
  return <PuzzleContainer />;

  // TODO : use RSC
  // return (
  //   <React.Suspense
  //     fallback={
  //       <ActivityIndicator />
  //     }
  //   >
  //     <PuzzleContainer />
  //   </React.Suspense>
  // );
}
