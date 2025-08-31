import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { AnimatedRectanglesLayerHandle } from "@/components/logo/advanced-animated";
import { InformationScreen } from "@/modules/informations";

export default function InformationsScreen() {
  const { styles, theme } = useTheme();
  const { typography, buttons } = styles;
  const { containers } = styles;
  const headerRef = useRef<AnimatedRectanglesLayerHandle>(null);

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
          <Link href="/" asChild>
            <Text style={buttons.linkButton}>Back</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
