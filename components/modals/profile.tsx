import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { User } from "@/types";

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onSwitchPlayer: () => void;
  onRecoverPlayer: () => void;
  user: User | null;
};

export default function ProfileModal({
  visible,
  onClose,
  onSwitchPlayer,
  onRecoverPlayer,
  user,
}: ProfileModalProps) {
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
          <Text style={[styles.typography.title, { marginBottom: 12 }]}>
            Player
          </Text>

          {user ? (
            <>
              <Text style={[styles.typography.body, { marginBottom: 6 }]}>
                {user.userName}
              </Text>
              <Text style={[styles.typography.label, { marginBottom: 24 }]}>
                {user.bestScore != null
                  ? `Best score on this device: ${user.bestScore}`
                  : "No score registered yet on this device"}
              </Text>
            </>
          ) : (
            <Text style={[styles.typography.body, { marginBottom: 24 }]}>
              No player registered on this device yet. Land a top 10 score to
              add your name to the leaderboard.
            </Text>
          )}

          <View
            style={[
              styles.containers.row,
              { justifyContent: "space-between" },
            ]}
          >
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.buttons.linkButton}>Close</Text>
            </TouchableOpacity>

            {user ? (
              <TouchableOpacity
                onPress={() => {
                  onSwitchPlayer();
                  onClose();
                }}
              >
                <Text style={styles.buttons.linkButton}>
                  Play as someone else
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onRecoverPlayer}>
                <Text style={styles.buttons.linkButton}>
                  Recover by email
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
