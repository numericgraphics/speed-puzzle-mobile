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
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    color: "gray",
  },
});
