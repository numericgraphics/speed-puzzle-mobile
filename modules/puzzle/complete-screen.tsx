import React, { useEffect, useRef } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import {
  AnimatedRectanglesLayer,
  AnimatedRectanglesLayerHandle,
} from "@/components/logo/advanced-animated";
import { User } from "@/types";

export const ScoreRow = ({ name, score }: { name: string; score: number }) => {
  const { styles } = useTheme();
  const { containers, typography } = styles;
  return (
    <View
      style={[
        containers.row,
        {
          width: "100%",
          justifyContent: "space-between",
        },
      ]}
    >
      <Text style={[typography.body]}>{name}</Text>
      <Text style={[typography.label]}>{score}</Text>
    </View>
  );
};

interface CompletedPuzzleProps {
  onRestart: () => void;
  score: number;
  scores: any[];
  compareResult: boolean;
  register: () => void;
  user: User | null;
}

export function CompletedPuzzle({
  onRestart,
  score,
  scores,
  compareResult,
  register,
  user,
}: CompletedPuzzleProps) {
  const { styles, theme, isDark } = useTheme();
  const { containers, typography, buttons } = styles;
  const animationRef = useRef<AnimatedRectanglesLayerHandle>(null);

  console.log("CompletedPuzzle - compareResult", compareResult);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationRef.current?.handleStartY();
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(1000)}
      exiting={FadeOut.duration(300)}
      style={containers.centeredFullScreen}
    >
      <View style={{ bottom: theme.spacer[5].y }}>
        <AnimatedRectanglesLayer
          ref={animationRef}
          width={50}
          height={50}
          color={isDark ? theme.color.white : theme.color.black}
        />
      </View>

      <Text style={[typography.title, { paddingBottom: theme.spacer[1].y }]}>
        {compareResult ? "Bravo" : "Good"} {user?.userName}, you finished the
        game !
      </Text>
      <Text
        style={[typography.labelBold, { paddingBottom: theme.spacer[2].y }]}
      >
        {compareResult
          ? "Your score is in the 10 best scores"
          : "Your final score"}
      </Text>
      <Text
        style={[
          typography.title,
          {
            fontSize: 48,
            fontWeight: "bold",
            paddingBottom: theme.spacer[3].y,
          },
        ]}
      >
        {score}
      </Text>
      <Text
        style={[typography.labelBold, { paddingBottom: theme.spacer[2].y }]}
      >
        Higher Scores
      </Text>
      <FlatList
        data={scores}
        renderItem={({ item }) => (
          <ScoreRow name={item.user.userName} score={item.score} />
        )}
        keyExtractor={(item, index) => item.user.userName + index}
        style={{ maxHeight: "20%", marginHorizontal: theme.spacer[8].x }}
      />
      {compareResult && (
        <TouchableOpacity disabled={!compareResult} onPress={() => register()}>
          <Text style={[buttons.linkButton, { marginTop: theme.spacer[2].y }]}>
            {user ? "Register your score" : "Sign up to save your score"}
          </Text>
        </TouchableOpacity>
      )}
      <Text
        style={[buttons.linkButton, { marginTop: theme.spacer[2].y }]}
        onPress={() => {
          animationRef.current?.handleEndX(() => onRestart());
        }}
      >
        Play again !
      </Text>
    </Animated.View>
  );
}
