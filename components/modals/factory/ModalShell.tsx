import React, { ReactNode } from "react";
import { Modal, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type ModalShellProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  /** Card max width — larger modals (multi-field forms) can opt into more room. */
  maxWidth?: number;
};

// Single place every modal in the app goes through — swap `animationType`
// here to retune how they all open/close.
export function ModalShell({
  visible,
  onRequestClose,
  children,
  maxWidth = 460,
}: ModalShellProps) {
  const { styles, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
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
            maxWidth,
            padding: 28,
            borderRadius: 25,
            borderColor: isDark ? "#fff" : "#000",
            borderWidth: 1,
            backgroundColor: styles.containers.main?.backgroundColor ?? "#fff",
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
