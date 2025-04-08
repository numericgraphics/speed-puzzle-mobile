"use server";

import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PuzzleContainer from "@/modules/puzzle/puzzle-container-draggable";

export default function Puzzle() {
  return <PuzzleContainer />;
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
