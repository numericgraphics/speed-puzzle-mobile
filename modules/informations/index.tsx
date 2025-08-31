// modules/information/index.tsx
import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Bold, Divider, Paragraph, Section } from "@/helpers/ui";

export const InformationScreen: React.FC = () => {
  const { styles, theme } = useTheme();
  const { typography } = styles;
  return (
    <View>
      <Paragraph>
        You play through <Bold>10 puzzle rounds</Bold>. A timer starts as soon
        as each round begins. Finish as fast as possible with as few moves as
        possible. When you complete the puzzle (or the timer runs out), the
        round ends and you move on to the next one. At the end, you’ll see your
        total score for all 10 rounds.
      </Paragraph>

      <Divider />

      <Section title="Scoring & Complexity">
        <Paragraph>
          Every round has a <Bold>complexity level from 1 to 3</Bold>.
          Complexity defines three things: the base points you start with
          (higher complexity means more base points), the target time for the
          round, and the ideal number of moves (equal to the complexity level).
        </Paragraph>
        <Paragraph>
          Concretely: level 1 starts at 100 points (1s target, 1 ideal move),
          level 2 starts at 150 points (3s target, 2 ideal moves), and level 3
          starts at 200 points (6s target, 3 ideal moves).
        </Paragraph>
        <Paragraph>
          Your score for a round begins at the base points. If you take longer
          than the target time, you lose <Bold>1 point per extra second</Bold>.
          If you use more moves than the ideal, you lose{" "}
          <Bold>2 points per extra move</Bold>. There’s no bonus for being
          faster than the target or using fewer moves than ideal. Scores are
          rounded and never drop below 0. Your total game score is the sum of
          all 10 rounds.
        </Paragraph>
      </Section>

      <Divider />

      <Section title="Registration & Saving Scores">
        <Paragraph>
          You can register a <Bold>username</Bold> and save your result in our
          leaderboard
          <Bold> only if your score qualifies</Bold> — that means it is among
          the
          <Bold> 10 lowest scores</Bold> currently recorded (lower is better).
          When you finish a game and your score makes the cut, you’ll be invited
          to create a username (with a password) and save that score. Usernames
          must be unique.
        </Paragraph>
        <Paragraph>
          After you’ve registered once, every time you finish a game we’ll
          <Bold> automatically save</Bold> your result —
          <Bold> but only if it improves your saved score</Bold>. If it doesn’t
          beat your best, it won’t replace it (that’s normal).
        </Paragraph>
      </Section>

      <Divider />

      <Section title="Tips">
        <Paragraph>
          Aim for the ideal moves first — each extra move costs twice as much as
          an extra second. Then squeeze your time under the target. Higher
          complexity can earn you more points, but delays and extra moves will
          eat them quickly.
        </Paragraph>
      </Section>
    </View>
  );
};
