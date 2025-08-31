import { useTheme } from "@/hooks/useTheme";
import { View, Text } from "react-native";

export const Paragraph: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { styles, theme } = useTheme();
  return (
    <Text
      style={[
        styles.typography.body,
        { textAlign: "left", marginBottom: theme.spacer[2].y },
      ]}
    >
      {children}
    </Text>
  );
};

export const Bold: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { styles } = useTheme();
  return <Text style={styles.typography.bodyBold}>{children}</Text>;
};

export const Section: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  const { styles, theme } = useTheme();
  return (
    <View style={{ marginTop: theme.spacer[2].y }}>
      <Text
        style={[
          styles.typography.bodyBold,
          { fontSize: theme.text.fontSize.lg },
          { marginBottom: theme.spacer[1].y },
        ]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <View>{children}</View>
    </View>
  );
};

export const Divider: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        height: 1,
        opacity: 0.2,
        backgroundColor: theme.color[400] ?? theme.color.black,
        marginVertical: theme.spacer[3].y,
        width: "100%",
      }}
    />
  );
};
