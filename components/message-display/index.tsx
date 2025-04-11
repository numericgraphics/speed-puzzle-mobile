// src/components/StatusMessage.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusMessageProps {
  message: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  return (
    <View style={styles.rowItem}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rowItem: {
    // sample styling
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  text: {
    fontSize: 16,
    color: "#fff", // or any color
  },
});
