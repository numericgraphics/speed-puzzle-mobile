import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { ScoreConfirmModalProps } from "./types";

export function SubmittedStep({
  onRequestClose,
  userName,
  score,
}: ScoreConfirmModalProps) {
  const { styles, theme } = useTheme();

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: theme.spacer[1].y }]}>
        Score Saved 🎉
      </Text>
      <Text style={[styles.typography.body, { marginBottom: theme.spacer[3].y }]}>
        {score} is now on the leaderboard for {userName}.
      </Text>
      <View style={[styles.containers.row, { justifyContent: "flex-end" }]}>
        <Button label="Continue" icon="arrow-right" onPress={onRequestClose} />
      </View>
    </>
  );
}
