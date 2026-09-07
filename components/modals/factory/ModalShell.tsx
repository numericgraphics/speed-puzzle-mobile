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
  const { theme, styles, isDark } = useTheme();

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
          { padding: theme.spacer[3].x, backgroundColor: theme.color.overlay },
        ]}
      >
        <View
          style={{
            width: "100%",
            maxWidth,
            padding: theme.spacer[3].x,
            borderRadius: 25,
            borderColor: isDark ? theme.color.white : theme.color.black,
            borderWidth: 1,
            backgroundColor:
              styles.containers.main?.backgroundColor ?? theme.color.white,
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
