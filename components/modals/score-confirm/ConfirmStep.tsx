import React from "react";
import { Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FormActions } from "../factory/FormActions";
import { ScoreConfirmModalProps } from "./types";

export function ConfirmStep({
  onRequestClose,
  onConfirm,
  userName,
  score,
  submitting,
  submitError,
}: ScoreConfirmModalProps) {
  const { styles, theme } = useTheme();

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>
        New Top Score 🎉
      </Text>
      <Text style={[styles.typography.body, { marginBottom: theme.spacer[2].y }]}>
        Save {score} to the leaderboard as {userName}?
      </Text>

      {submitError ? (
        <Text style={[styles.typography.label, { color: "red", marginBottom: 10 }]}>
          {submitError}
        </Text>
      ) : null}

      <FormActions
        onCancel={onRequestClose}
        onSubmit={onConfirm}
        submitLabel="Save Score"
        submittingLabel="Saving..."
        submitting={submitting}
      />
    </>
  );
}
