import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { AccountModalProps } from "./types";

const COPIED_RESET_MS = 2000;

export function KeyRevealStep({
  onRequestClose,
  user,
  generatedKey,
}: AccountModalProps) {
  const { styles, theme, isDark, maxFontSizeMultiplier } = useTheme();
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
      <Text
        style={[styles.typography.title, { marginBottom: theme.spacer[1].y }]}
      >
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
          borderColor: isDark ? theme.color.white : theme.color.black,
          marginBottom: theme.spacer[2].y,
        }}
      >
        <Text
          style={[
            styles.typography.title,
            {
              letterSpacing: 2,
              textAlign: "center",
              fontFamily: "monospace",
            },
          ]}
          maxFontSizeMultiplier={maxFontSizeMultiplier.title}
          selectable
        >
          {generatedKey}
        </Text>
      </View>

      <Button
        label={copied ? "Copied ✓" : "Copy key"}
        icon="content-copy"
        onPress={copyKey}
        fullWidth
        style={{ marginBottom: theme.spacer[2].y }}
      />

      <View style={[styles.containers.row, { justifyContent: "flex-end" }]}>
        <Button label="Continue" icon="arrow-right" onPress={onRequestClose} />
      </View>
    </>
  );
}
