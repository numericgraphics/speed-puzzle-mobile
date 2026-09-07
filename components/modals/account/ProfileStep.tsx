import React from "react";
import { Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { AccountModalProps } from "./types";

export function ProfileStep({
  onRequestClose,
  user,
  onSwitchPlayer,
}: AccountModalProps) {
  const { styles, theme } = useTheme();

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: theme.spacer[1].y }]}>
        Player
      </Text>
      <Text style={[styles.typography.body, { marginBottom: theme.spacer[1].y }]}>
        {user?.userName}
      </Text>
      <Text style={[styles.typography.label, { marginBottom: theme.spacer[3].y }]}>
        {user?.bestScore != null
          ? `Best score on this device: ${user.bestScore}`
          : "No score registered yet on this device"}
      </Text>
      <ButtonGroup>
        <Button label="Close" icon="cancel" onPress={onRequestClose} />
        <Button
          label="Logout"
          icon="logout"
          onPress={() => {
            onSwitchPlayer();
            onRequestClose();
          }}
        />
      </ButtonGroup>
    </>
  );
}
