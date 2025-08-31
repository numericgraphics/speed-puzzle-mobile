import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import {
  AnimatedRectanglesLayer,
  AnimatedRectanglesLayerHandle,
} from "@/components/logo/advanced-animated";
import { InformationScreen } from "@/modules/informations";

export default function InformationsScreen() {
  const { styles, theme, isDark } = useTheme();
  const { typography, buttons } = styles;
  const headerRef = useRef<AnimatedRectanglesLayerHandle>(null);

  const HEADER_HEIGHT = 140; // enough space for the animation + title
  const FOOTER_HEIGHT = 80; // space for the back button

  return (
    <View style={{ flex: 1 }}>
      {/* Sticky Header */}
      <View
        style={{
          //   position: "absolute",
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
          //   position: "absolute",
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
  );
}
