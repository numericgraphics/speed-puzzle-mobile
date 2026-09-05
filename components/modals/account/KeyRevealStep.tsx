import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/hooks/useTheme";
import { AccountModalProps } from "./types";

const COPIED_RESET_MS = 2000;

export function KeyRevealStep({
  onRequestClose,
  user,
  generatedKey,
}: AccountModalProps) {
  const { styles, theme, isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copyKey = async () => {
    if (!generatedKey) return;
    await Clipboard.setStringAsync(generatedKey);
    setCopied(true);
  };

  return (
    <>
      <Text style={[styles.typography.title, { marginBottom: 12 }]}>
        You're on the Board 🎉
      </Text>
      <Text style={[styles.typography.body, { marginBottom: theme.spacer[2].y }]}>
        Save this recovery key somewhere safe. It's the only way to sign
        back in as {user?.userName} on another device — we can't show it
        to you again.
      </Text>
      <View
        style={{
          padding: theme.spacer[2].y,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isDark ? "#fff" : "#000",
          marginBottom: theme.spacer[2].y,
        }}
      >
        <Text
          style={[
            styles.typography.title,
            {
              fontSize: 28,
              letterSpacing: 2,
              textAlign: "center",
              fontFamily: "monospace",
            },
          ]}
          selectable
        >
          {generatedKey}
        </Text>
      </View>

      <TouchableOpacity onPress={copyKey} style={{ marginBottom: theme.spacer[2].y }}>
        <Text style={[styles.buttons.linkButton, { textAlign: "center" }]}>
          {copied ? "Copied ✓" : "Copy key"}
        </Text>
      </TouchableOpacity>

      <View style={[styles.containers.row, { justifyContent: "flex-end" }]}>
        <TouchableOpacity onPress={onRequestClose}>
          <Text style={styles.buttons.linkButton}>Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
