import { computeChallengeScore } from "../actions/result-actions";
import { GameChallengeType, useGameStore } from "@/stores/game";

type ChallengeArgs = {
  complexity: number;
  timerValue: number; // ms
  moves: number;
};

/* helper to build a minimal, type-safe challenge */
const make = ({
  complexity,
  timerValue,
  moves,
}: ChallengeArgs): GameChallengeType => ({
  complexity,
  timerValue,
  moves,
  image: {} as any,
  pieces: [],
  isVertical: false,
});

/* brand-new unit tests for the helper ---------------------------- */
describe("computeChallengeScore (unit)", () => {
  const cases = [
    make({ complexity: 1, timerValue: 5000, moves: 1 }),
    make({ complexity: 2, timerValue: 3000, moves: 2 }),
    make({ complexity: 3, timerValue: 6000, moves: 3 }),
    make({ complexity: 1, timerValue: 8000, moves: 2 }),
    make({ complexity: 2, timerValue: 10000, moves: 4 }),
  ];

  cases.forEach((challenge, idx) => {
    it(`prints score for challenge #${idx + 1}`, () => {
      const score = computeChallengeScore(challenge);
      // eslint-disable-next-line no-console
      console.log(`Challenge ${idx + 1} score:`, score);
      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });
});
