import { useTheme } from "@/hooks/useTheme";
import PuzzleContainer from "@/modules/puzzle";

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function Page() {
  const { styles, theme } = useTheme();
  const { containers, typography, buttons } = styles;
  return (
    <SafeAreaView style={containers.main}>
      <PuzzleContainer />
    </SafeAreaView>
  );
}
