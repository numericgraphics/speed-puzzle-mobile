import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type ScoreConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  score: number;
  submitting: boolean;
  submitted: boolean;
  submitError?: string | null;
};

export default function ScoreConfirmModal({
  visible,
  onClose,
  onConfirm,
  userName,
  score,
  submitting,
  submitted,
  submitError,
}: ScoreConfirmModalProps) {
  const { styles, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.containers.centeredFullScreen,
          { padding: 24, backgroundColor: "rgba(0,0,0,0.6)" },
        ]}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 25,
            borderRadius: 25,
            borderColor: isDark ? "#fff" : "#000",
            borderWidth: 1,
            backgroundColor: styles.containers.main?.backgroundColor ?? "#fff",
          }}
        >
          {submitted ? (
            <>
              <Text style={[styles.typography.title, { marginBottom: 12 }]}>
                Score Saved 🎉
              </Text>
              <Text style={[styles.typography.body, { marginBottom: 24 }]}>
                {score} is now on the leaderboard for {userName}.
              </Text>
              <View style={[styles.containers.row, { justifyContent: "flex-end" }]}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.buttons.linkButton}>Continue</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.typography.title, { marginBottom: 12 }]}>
                New Top Score 🎉
              </Text>
              <Text style={[styles.typography.body, { marginBottom: 16 }]}>
                Save {score} to the leaderboard as {userName}?
              </Text>

              {submitError ? (
                <Text
                  style={[
                    styles.typography.label,
                    { color: "red", marginBottom: 10 },
                  ]}
                >
                  {submitError}
                </Text>
              ) : null}

              <View
                style={[
                  styles.containers.row,
                  { justifyContent: "space-between", marginTop: 20 },
                ]}
              >
                <TouchableOpacity onPress={onClose} disabled={submitting}>
                  <Text style={styles.buttons.linkButton}>Not now</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onConfirm} disabled={submitting}>
                  <Text style={styles.buttons.linkButton}>
                    {submitting ? "Saving..." : "Save Score"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
