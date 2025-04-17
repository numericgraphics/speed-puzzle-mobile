import React from "react";
import { SafeAreaView } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import PuzzleContainer from "@/modules/puzzle";

export default function Page() {
  const { styles } = useTheme();
  const { containers } = styles;
  return (
    <SafeAreaView style={containers.main}>
      <PuzzleContainer />
    </SafeAreaView>
  );
}
