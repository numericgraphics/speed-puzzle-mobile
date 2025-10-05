import { computeChallengeScore, computeTotalScore } from "@/helpers/scores";
import type { GameChallengeType } from "@/stores/game";

function makeChallenge(partial: Partial<GameChallengeType>): GameChallengeType {
  return {
    image: {} as any,
    pieces: [] as any,
    isVertical: false,
    complexity: 1,
    moves: 0,
    timerValue: 0,
    ...partial,
  };
}

describe("scores helper", () => {
  describe("computeChallengeScore", () => {
    it("uses time as the primary component (ms)", () => {
      const fastWithMoves = makeChallenge({ complexity: 2, moves: 5, timerValue: 1500 }); // 1500ms, 3 extra moves
      const slowNoMoves = makeChallenge({ complexity: 2, moves: 2, timerValue: 2500 }); // 2500ms, 0 extra moves

      const s1 = computeChallengeScore(fastWithMoves); // 1500 + 3*1000 = 4500
      const s2 = computeChallengeScore(slowNoMoves);   // 2500 + 0 = 2500

      expect(s2).toBe(2500);
      expect(s1).toBe(4500);
      expect(s2).toBeLessThan(s1);
    });

    it("penalizes only moves beyond complexity (ms)", () => {
      const equalMoves = makeChallenge({ complexity: 3, moves: 3, timerValue: 1000 });
      const extraMoves = makeChallenge({ complexity: 3, moves: 5, timerValue: 1000 });

      expect(computeChallengeScore(equalMoves)).toBe(1000);
      // 2 extra moves => +2000ms penalty (1000 each)
      expect(computeChallengeScore(extraMoves)).toBe(3000);
    });

    it("fewer moves than complexity reduces score via a capped bonus (ms)", () => {
      const slightBonus = makeChallenge({ complexity: 3, moves: 2, timerValue: 2500 });
      // 1 move under complexity => -500ms bonus.
      expect(computeChallengeScore(slightBonus)).toBe(2000);

      const largeBonus = makeChallenge({ complexity: 3, moves: 1, timerValue: 2000 });
      // 2 moves under complexity => -1000ms bonus, limited by 50% of elapsed time.
      expect(computeChallengeScore(largeBonus)).toBe(1000);
    });

    it("limits bonuses to half of the elapsed time", () => {
      const capped = makeChallenge({ complexity: 5, moves: 0, timerValue: 2000 });
      // Raw bonus 5 * 500 = 2500 but capped at 1000 (50% of 2000).
      expect(computeChallengeScore(capped)).toBe(1000);
    });
  });

  describe("computeTotalScore", () => {
    it("sums per-challenge scores (ms)", () => {
      const a = makeChallenge({ complexity: 1, moves: 1, timerValue: 1000 }); // 1000
      const b = makeChallenge({ complexity: 2, moves: 4, timerValue: 1500 }); // 1500 + 2*1000 = 3500
      const c = makeChallenge({ complexity: 3, moves: 2, timerValue: 2200 }); // 2200 - 500 = 1700

      expect(computeTotalScore([a, b, c])).toBe(6200);
    });

    it("returns 0 for empty results", () => {
      expect(computeTotalScore([])).toBe(0);
    });
  });
});
