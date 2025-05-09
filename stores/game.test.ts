import { useGameStore } from "./game";

type ChallengeArgs = {
  complexity: number;
  timerValue: number; // ms
  moves: number;
};

// helper to build a minimal challenge
const make = ({ complexity, timerValue, moves }: ChallengeArgs) => ({
  completed: true,
  complexity,
  timerValue,
  moves,
  image: {} as any,
  pieces: [],
});

describe("getScore (called with mocked challenges)", () => {
  it("runs without touching setState or mocking getScore", () => {
    // Five compliant challenges
    const challenges = [
      make({ complexity: 1, timerValue: 5000, moves: 1 }),
      make({ complexity: 2, timerValue: 3000, moves: 2 }),
      make({ complexity: 3, timerValue: 6000, moves: 3 }),
      make({ complexity: 1, timerValue: 8000, moves: 2 }),
      make({ complexity: 2, timerValue: 10000, moves: 4 }),
    ];

    // --- Inject the challenges WITHOUT setState -------------------
    // get() (inside getScore) will read from this same object.
    const state = useGameStore.getState();
    (state as any).challenges = challenges;

    // --- Call the real getScore -----------------------------------
    const score = state.actions.getScore();
    expect(typeof score).toBe("number");
    // no result check requested
  });
});
