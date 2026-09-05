import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ScoreConfirmModalProps } from "./types";

export function SubmittedStep({
  onRequestClose,
  userName,
  score,
}: ScoreConfirmModalProps) {
  const { styles, theme } = useTheme();

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>
        Score Saved 🎉
      </Text>
      <Text style={[styles.typography.body, { marginBottom: theme.spacer[3].y }]}>
        {score} is now on the leaderboard for {userName}.
      </Text>
      <View style={[styles.containers.row, { justifyContent: "flex-end" }]}>
        <TouchableOpacity onPress={onRequestClose}>
          <Text style={styles.buttons.linkButton}>Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
