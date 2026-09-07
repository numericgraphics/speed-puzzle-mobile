import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { InformationScreen } from "@/modules/informations";

export default function InformationsScreen() {
  const { styles, theme } = useTheme();
  const { typography } = styles;
  const { containers } = styles;
  const HEADER_HEIGHT = 140;
  const FOOTER_HEIGHT = 80;

  return (
    <SafeAreaView style={[containers.main, containers.centeredFullScreen]}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: HEADER_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              typography.title,
              { marginTop: theme.spacer[2].y, textAlign: "center" },
            ]}
          >
            How to Play
          </Text>
        </View>

        {/* Scrollable Content (no title / no animation inside) */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacer[3].x,
            paddingTop: theme.spacer[2].y,
            paddingBottom: FOOTER_HEIGHT + theme.spacer[2].y,
          }}
          showsVerticalScrollIndicator={false}
        >
          <InformationScreen />
        </ScrollView>

        {/* Sticky Footer (Back button) */}
        <View
          style={{
            left: 0,
            right: 0,
            bottom: 0,
            height: FOOTER_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: theme.spacer[2].y,
          }}
        >
          <Button
            label="Back"
            icon="home"
            onPress={() => router.replace("/")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
