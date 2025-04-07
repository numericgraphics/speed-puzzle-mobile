"use server";

import PuzzleContainer from "@/modules/puzzle/puzzle-container-draggable";
import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

const getMockData = async (
  data: string = "",
  error: string = "unknown server error",
  delay: number = 1000
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!!data) {
        resolve({
          type: "Success ✅",
          data,
        });
      } else {
        reject({
          type: "Error ❌",
          message: error,
        });
      }
    }, delay || 1000);
  });
};

export default async function fetchPuzzle() {
  const data = await getMockData("test mocking");
  return <PuzzleContainer data={data} />;
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
