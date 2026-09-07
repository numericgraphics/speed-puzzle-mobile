import { useEffect, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import {
  AnimatedRectanglesLayer,
  AnimatedRectanglesLayerHandle,
} from "@/components/logo/advanced-animated";
import { useRegistration } from "@/hooks/use-registration";
import { User } from "@/types";
import { ScoreRow as ScoreRowData } from "@/lib/api";
import { log } from "@/lib/logger";

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
  onGoHome: () => void;
  score: number;
  scores: ScoreRowData[];
  compareResult: boolean;
  register: () => void;
  registered: boolean;
  user: User | null;
}

export function CompletedPuzzle({
  onRestart,
  onGoHome,
  score,
  scores,
  compareResult,
  register,
  registered,
  user,
}: CompletedPuzzleProps) {
  const { styles, theme, isDark, maxFontSizeMultiplier } = useTheme();
  const { containers, typography } = styles;
  const animationRef = useRef<AnimatedRectanglesLayerHandle>(null);
  const { open } = useRegistration();

  log.scores.debug("CompletedPuzzle - compareResult", compareResult);

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
        <TouchableOpacity onPress={open}>
          <AnimatedRectanglesLayer
            ref={animationRef}
            width={50}
            height={50}
            color={isDark ? theme.color.white : theme.color.black}
          />
        </TouchableOpacity>
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
        style={[typography.display, { paddingBottom: theme.spacer[3].y }]}
        maxFontSizeMultiplier={maxFontSizeMultiplier.display}
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
        <>
          {registered ? (
            <Text
              style={[
                typography.label,
                { marginTop: theme.spacer[2].y, opacity: 0.7 },
              ]}
            >
              Score registered ✓
            </Text>
          ) : (
            <Button
              label={user ? "Register your score" : "Sign up to save your score"}
              icon="account-plus"
              onPress={() => register()}
              style={{ marginTop: theme.spacer[2].y }}
            />
          )}
        </>
      )}
      <Button
        label="Play again !"
        icon="play"
        onPress={() => {
          animationRef.current?.handleEndX(() => onRestart());
        }}
        style={{ marginTop: theme.spacer[2].y }}
      />
      <Button
        label="Back to Home"
        icon="home"
        onPress={() => {
          animationRef.current?.handleEndX(() => onGoHome());
        }}
        style={{ marginTop: theme.spacer[2].y }}
      />
    </Animated.View>
  );
}
