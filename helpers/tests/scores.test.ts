import { computeChallengeScore, computeTotalScore } from "@/helpers/scores";
import type { GameChallengeType } from "@/stores/game";

// complexity is the minimum number of moves needed to solve the puzzle
// (see utils/array.ts getMinimumOperationsToSortArray), so moves can never
// be lower than complexity — every challenge here respects that floor.
function makeChallenge(partial: Partial<GameChallengeType>): GameChallengeType {
  return {
    image: {} as any,
    pieces: [] as any,
    isVertical: false,
    complexity: 1,
    moves: 1,
    timerValue: 0,
    ...partial,
  };
}

describe("scores helper", () => {
  describe("computeChallengeScore", () => {
    it("awards base points plus the full move bonus for an optimal, on-target solve", () => {
      // moves === complexity (optimal) and elapsed === ideal time: base + 10% move bonus, no time bonus/penalty.
      const tier1 = makeChallenge({ complexity: 1, moves: 1, timerValue: 1000 });
      const tier2 = makeChallenge({ complexity: 2, moves: 2, timerValue: 3000 });
      const tier3 = makeChallenge({ complexity: 3, moves: 3, timerValue: 6000 });

      expect(computeChallengeScore(tier1)).toBe(110);
      expect(computeChallengeScore(tier2)).toBe(165);
      expect(computeChallengeScore(tier3)).toBe(220);
    });

    it("higher complexity yields a higher score for an equally optimal, on-target run", () => {
      const tier1 = makeChallenge({ complexity: 1, moves: 1, timerValue: 1000 });
      const tier2 = makeChallenge({ complexity: 2, moves: 2, timerValue: 3000 });
      const tier3 = makeChallenge({ complexity: 3, moves: 3, timerValue: 6000 });

      const s1 = computeChallengeScore(tier1);
      const s2 = computeChallengeScore(tier2);
      const s3 = computeChallengeScore(tier3);

      expect(s1).toBeLessThan(s2);
      expect(s2).toBeLessThan(s3);
    });

    it("scales the time penalty by the tier's base points", () => {
      // 2s over ideal, optimal moves: tier1 loses 2*100*0.1=20 on top of the +10 move bonus; tier3 loses 2*200*0.1=40 on top of +20.
      const tier1Late = makeChallenge({ complexity: 1, moves: 1, timerValue: 3000 });
      const tier3Late = makeChallenge({ complexity: 3, moves: 3, timerValue: 8000 });

      expect(computeChallengeScore(tier1Late)).toBe(90); // 100 + 10 - 20
      expect(computeChallengeScore(tier3Late)).toBe(180); // 200 + 20 - 40
    });

    it("rewards beating the ideal time with a bonus, capped at 25% of base points", () => {
      // Tier 3, 1s under ideal time, optimal moves: base + move bonus(20) + time bonus(1*200*0.05=10).
      const underTime = makeChallenge({ complexity: 3, moves: 3, timerValue: 5000 });
      expect(computeChallengeScore(underTime)).toBe(230);

      // Huge time underrun: time bonus caps at 25% of base (50), move bonus still 20.
      const hugeTimeBonus = makeChallenge({ complexity: 3, moves: 3, timerValue: 0 });
      expect(computeChallengeScore(hugeTimeBonus)).toBe(270); // 200 + 20 + 50
    });

    it("decays the move bonus as extra moves accumulate, breaking even at 2 extra moves", () => {
      // Tier 3, on-target time. 1 extra move: (0.1 - 1*0.05)*200 = 10.
      const oneExtra = makeChallenge({ complexity: 3, moves: 4, timerValue: 6000 });
      expect(computeChallengeScore(oneExtra)).toBe(210);

      // 2 extra moves: (0.1 - 2*0.05)*200 = 0 — breakeven, no bonus or penalty from moves.
      const twoExtra = makeChallenge({ complexity: 3, moves: 5, timerValue: 6000 });
      expect(computeChallengeScore(twoExtra)).toBe(200);

      // 4 extra moves: (0.1 - 4*0.05)*200 = -20 — now a penalty.
      const fourExtra = makeChallenge({ complexity: 3, moves: 7, timerValue: 6000 });
      expect(computeChallengeScore(fourExtra)).toBe(180);
    });

    it("caps the move penalty at 25% of the tier's base points regardless of how many extra moves", () => {
      const manyExtra = makeChallenge({ complexity: 3, moves: 3 + 20, timerValue: 6000 });
      const wayTooMany = makeChallenge({ complexity: 3, moves: 3 + 200, timerValue: 6000 });

      expect(computeChallengeScore(manyExtra)).toBe(150); // 200 - 50 (capped)
      expect(computeChallengeScore(wayTooMany)).toBe(150); // same cap
    });

    it("never produces a score below 0", () => {
      const veryLate = makeChallenge({ complexity: 1, moves: 21, timerValue: 60000 });
      expect(computeChallengeScore(veryLate)).toBe(0);
    });

    it("treats out-of-range complexity by clamping to the nearest valid tier", () => {
      const belowRange = makeChallenge({ complexity: 0, moves: 1, timerValue: 1000 });
      const aboveRange = makeChallenge({ complexity: 5, moves: 3, timerValue: 6000 });

      expect(computeChallengeScore(belowRange)).toBe(110);
      expect(computeChallengeScore(aboveRange)).toBe(220);
    });
  });

  describe("computeTotalScore", () => {
    it("sums per-challenge scores", () => {
      const a = makeChallenge({ complexity: 1, moves: 1, timerValue: 1000 }); // 110
      const b = makeChallenge({ complexity: 2, moves: 2, timerValue: 3000 }); // 165
      const c = makeChallenge({ complexity: 3, moves: 3, timerValue: 6000 }); // 220

      expect(computeTotalScore([a, b, c])).toBe(495);
    });

    it("stays within [0, 10 * perChallengeMax] across a full 10-challenge game", () => {
      // Per-challenge ceiling: tier-3 base (200) + move bonus (20) + capped time bonus (50) = 270.
      const perChallengeMax = 270;
      const challenges = Array.from({ length: 10 }, (_, i) =>
        makeChallenge({
          complexity: (i % 3) + 1,
          moves: i + 1,
          timerValue: i * 1000,
        })
      );

      const total = computeTotalScore(challenges);
      expect(total).toBeGreaterThanOrEqual(0);
      expect(total).toBeLessThanOrEqual(10 * perChallengeMax);
    });

    it("returns 0 for empty results", () => {
      expect(computeTotalScore([])).toBe(0);
    });
  });
});
