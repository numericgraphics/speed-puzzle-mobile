import type { GameChallengeType } from "@/stores/game";

const MAX_COMPLEXITY = 3;
// Adjustment applied per move relative to complexity, in milliseconds.
// Chosen to be larger than the former 0.5s to keep move cost meaningful with ms scoring.
const MOVE_PENALTY_MS = 1000;
const MOVE_BONUS_MS = 500;
const MAX_BONUS_RATIO = 0.5;

export function computeChallengeScore(
  challenge: GameChallengeType,
  _maxComplexity: number = MAX_COMPLEXITY
): number {
  const { complexity, timerValue, moves } = challenge;

  // Time-first scoring in milliseconds to yield larger numbers (lower is better).
  const elapsedMs = Math.max(0, Math.round(timerValue));

  const moveDelta = moves - complexity;

  let moveAdjustmentMs = 0;
  if (moveDelta > 0) {
    moveAdjustmentMs = moveDelta * MOVE_PENALTY_MS;
  } else if (moveDelta < 0) {
    const rawBonus = Math.abs(moveDelta) * MOVE_BONUS_MS;
    const maxBonus = Math.round(elapsedMs * MAX_BONUS_RATIO);
    moveAdjustmentMs = -Math.min(rawBonus, maxBonus);
  }

  // Integer millisecond score that bottoms out at zero.
  return Math.max(0, elapsedMs + moveAdjustmentMs);
}

export function computeTotalScore(
  results: GameChallengeType[],
  maxComplexity: number = MAX_COMPLEXITY
): number {
  if (!results || results.length === 0) return 0;
  const total = results.reduce((sum, challenge) => {
    return sum + computeChallengeScore(challenge, maxComplexity);
  }, 0);
  // Integer millisecond total score.
  return Math.max(0, Math.round(total));
}
