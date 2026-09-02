import type { GameChallengeType } from "@/stores/game";

// Complexity is fixed at 3 tiers (1, 2, 3) regardless of how many challenges
// make up a game — see helpers/puzzle.tsx checkPuzzleComplexity, bounded by
// PUZZLE_SLIDE_NUMBER.
const MAX_COMPLEXITY = 3;

interface ComplexityTier {
  basePoints: number;
  idealTimeSec: number;
  idealMoves: number;
}

// Per-tier targets. Base points and ideal time both scale with complexity so
// that overrunning a harder round costs (and rewards) proportionally the
// same as overrunning an easier one, rather than a single flat rate for all.
const TIERS: Record<number, ComplexityTier> = {
  1: { basePoints: 100, idealTimeSec: 1, idealMoves: 1 },
  2: { basePoints: 150, idealTimeSec: 3, idealMoves: 2 },
  3: { basePoints: 200, idealTimeSec: 6, idealMoves: 3 },
};

// Points lost per second beyond ideal time, as a fraction of that tier's
// base points — keeps the time penalty proportional across tiers instead of
// a flat 1 point/sec for every complexity.
const TIME_PENALTY_RATE = 0.1;
// Bonus for beating the ideal time, as a fraction of that tier's base
// points, capped so it can't inflate a challenge past a modest premium.
const TIME_BONUS_RATE = 0.05;
const MAX_TIME_BONUS_RATIO = 0.25;

// `complexity` is the minimum number of moves needed to solve the puzzle
// (see utils/array.ts getMinimumOperationsToSortArray), so `moves` can
// never be lower than it — every drag counts, including wasted ones. There
// is no "below par" case for moves, only "how close to optimal":
// moves === complexity earns the full move bonus, and each extra move
// decays it, crossing into a penalty past the grace window below.
// Breaks even (0 move points) at MOVE_BONUS_RATE / MOVE_PENALTY_RATE extra
// moves (2, with the rates below) — under that, moves are still net
// positive; beyond it, they cost points.
const MOVE_BONUS_RATE = 0.1;
const MOVE_PENALTY_RATE = 0.05;
const MAX_MOVE_PENALTY_RATIO = 0.25;

function getTier(complexity: number): ComplexityTier {
  const clamped = Math.min(Math.max(Math.round(complexity), 1), MAX_COMPLEXITY);
  return TIERS[clamped];
}

export function computeChallengeScore(challenge: GameChallengeType): number {
  const { complexity, timerValue, moves } = challenge;
  const { basePoints, idealTimeSec, idealMoves } = getTier(complexity);

  const elapsedSec = Math.max(0, timerValue) / 1000;
  const timeDelta = elapsedSec - idealTimeSec;

  const timePoints =
    timeDelta > 0
      ? -timeDelta * basePoints * TIME_PENALTY_RATE
      : Math.min(-timeDelta * basePoints * TIME_BONUS_RATE, basePoints * MAX_TIME_BONUS_RATIO);

  // extraMoves is always >= 0: moves can't go below complexity.
  const extraMoves = Math.max(0, moves - idealMoves);
  const movePoints = Math.max(
    (MOVE_BONUS_RATE - extraMoves * MOVE_PENALTY_RATE) * basePoints,
    -basePoints * MAX_MOVE_PENALTY_RATIO
  );

  const score = basePoints + timePoints + movePoints;

  return Math.max(0, Math.round(score));
}

export function computeTotalScore(results: GameChallengeType[]): number {
  if (!results || results.length === 0) return 0;
  const total = results.reduce(
    (sum, challenge) => sum + computeChallengeScore(challenge),
    0
  );
  return Math.max(0, Math.round(total));
}
