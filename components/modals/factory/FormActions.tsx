import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type FormActionsProps = {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submittingLabel: string;
  submitting: boolean;
  disabled?: boolean;
};

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel,
  submittingLabel,
  submitting,
  disabled,
}: FormActionsProps) {
  const { styles, theme } = useTheme();

  return (
    <View
      style={[
        styles.containers.row,
        { justifyContent: "space-between", marginTop: theme.spacer[3].y },
      ]}
    >
      <TouchableOpacity onPress={onCancel} disabled={submitting}>
        <Text style={styles.buttons.linkButton}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSubmit} disabled={disabled || submitting}>
        <Text style={styles.buttons.linkButton}>
          {submitting ? submittingLabel : submitLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
