import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AccountModalProps } from "./types";

export function ProfileStep({
  onRequestClose,
  user,
  onSwitchPlayer,
}: AccountModalProps) {
  const { styles, theme } = useTheme();

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>Player</Text>
      <Text style={[styles.typography.body, { marginBottom: 6 }]}>
        {user?.userName}
      </Text>
      <Text style={[styles.typography.label, { marginBottom: theme.spacer[3].y }]}>
        {user?.bestScore != null
          ? `Best score on this device: ${user.bestScore}`
          : "No score registered yet on this device"}
      </Text>
      <View style={[styles.containers.row, { justifyContent: "space-between" }]}>
        <TouchableOpacity onPress={onRequestClose}>
          <Text style={styles.buttons.linkButton}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSwitchPlayer();
            onRequestClose();
          }}
        >
          <Text style={styles.buttons.linkButton}>Play as someone else</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
