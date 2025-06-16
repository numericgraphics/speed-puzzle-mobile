// "use client";

import React, { useEffect, useRef } from "react";
import PuzzleStage from "@/modules/puzzle"; // existing grid logic
import { useGameStore } from "@/stores/game";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

function PuzzleClient({ challenges }) {
  console.log("PuzzleClient challenges:", challenges);
  const { styles, theme } = useTheme();
  const { containers, typography } = styles;
  //   const hydrated = useRef(false);

  return (
    <View style={containers.centeredFullScreen}>
      <Text style={typography.body}>PuzzleClient</Text>
    </View>
  );
}

export default PuzzleClient;

//   useEffect(() => {
//     if (!hydrated.current && challenges?.length) {
//       useGameStore.setState((state) => ({
//         ...state,
//         challenges,
//         started: true,
//         loading: false,
//       }));
//       hydrated.current = true;
//     }
//   }, [challenges]);
//   return <PuzzleStage />;
