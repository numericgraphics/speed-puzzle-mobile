import React from "react";
import { SafeAreaView } from "react-native";

import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

import { useTheme } from "@/hooks/useTheme";
import PuzzleContainer from "@/modules/puzzle";

export default function Page() {
  const { styles } = useTheme();
  const { containers } = styles;

  /** Main Puzzle Container
   *
   * DRIZZLE IMPLEMENTATION
   *
   */
  // const expo = SQLite.openDatabaseSync("db.db");
  // const db = drizzle(expo);
  /**
   *
   *
   */

  return (
    <SafeAreaView style={containers.main}>
      <PuzzleContainer />
    </SafeAreaView>
  );
}
