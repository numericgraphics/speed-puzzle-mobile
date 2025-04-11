import PuzzleContainer from "@/modules/puzzle";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <PuzzleContainer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});
