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
          round, and the <Bold>minimum number of moves</Bold> needed to solve
          it (equal to the complexity level) — you can never finish in fewer
          moves than that.
        </Paragraph>
        <Paragraph>
          Concretely: level 1 starts at 100 points (1s target, 1 minimum
          move), level 2 starts at 150 points (3s target, 2 minimum moves),
          and level 3 starts at 200 points (6s target, 3 minimum moves).
        </Paragraph>
        <Paragraph>
          Your score for a round begins at the base points. Solving it in the
          minimum number of moves earns a bonus on top; each move beyond that
          shrinks the bonus and eventually turns it into a penalty the more
          you go over. If you take longer than the target time, you lose
          points proportional to how far over you go — finishing under the
          target time earns a bonus instead, capped so it can’t run away.
          Scores are rounded and never drop below 0. Your total game score is
          the sum of all 10 rounds — <Bold>higher is better</Bold>.
        </Paragraph>
      </Section>

      <Divider />

      <Section title="Registration & Saving Scores">
        <Paragraph>
          You can register a <Bold>username</Bold> and save your result in our
          leaderboard
          <Bold> only if your score qualifies</Bold> — that means it is among
          the
          <Bold> 10 highest scores</Bold> currently recorded (higher is
          better). When you finish a game and your score makes the cut,
          you’ll be invited to sign up, like signing a high-score board — no
          email or password needed. Names must be unique.
        </Paragraph>
        <Paragraph>
          When you sign up, we generate a <Bold>recovery key</Bold> for you
          and show it once. <Bold>Write it down</Bold> — it’s the only way to
          get back into your account on another device or after
          reinstalling, and we can’t show it to you again.
        </Paragraph>
        <Paragraph>
          To reconnect on a new device, tap the logo and choose{" "}
          <Bold>Log in</Bold>, then enter your username and recovery key.
        </Paragraph>
        <Paragraph>
          After you’ve registered once, every time you finish a game we’ll
          <Bold> automatically save</Bold> your result —
          <Bold> but only if it improves your saved score</Bold>. If it doesn’t
          beat your best, it won’t replace it (that’s normal).
        </Paragraph>
        <Paragraph>
          The animated logo at the top of the start and result screens is
          tappable — tap it any time to <Bold>sign up, log in, or manage your
          profile</Bold>.
        </Paragraph>
      </Section>

      <Divider />

      <Section title="Tips">
        <Paragraph>
          Aim to solve each round in the minimum number of moves — that’s
          where the move bonus is highest, and it only takes a couple of
          extra moves to lose it entirely. Then squeeze your time under the
          target. Higher complexity can earn you more points, but a slow or
          wasteful solve will eat them quickly.
        </Paragraph>
      </Section>
    </View>
  );
};
