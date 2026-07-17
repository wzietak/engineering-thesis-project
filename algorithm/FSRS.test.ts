import { FSRS } from "./FSRS";
import { FSRSState } from "./FSRSState";
import { CardDirection, flashcardState, Grade } from "./FSRSTypes";

const fsrs = new FSRS();

function createMockFSRSState(overrides?: Partial<FSRSState>) {
  const fixedDate = new Date("2026-07-17T12:00:00Z").toISOString();
  return {
    id: "test-id",
    card_id: "test-card-id",
    card_direction: CardDirection.Forward,
    stability: null,
    difficulty: null,
    last_review: null,
    next_review: null,
    interval_days: null,
    state: flashcardState.New,
    reps: 0,
    lapses: 0,
    updated_at: fixedDate,
  };
}

describe("FSRS algorithm", () => {
  describe("Flashcard first review", () => {
    it("Initial values for 'Again' should be: difficulty = 6.4133, stability = 0.212, interval = 0.212", () => {
      const grade = Grade.Again;

      const flashcardState = createMockFSRSState();

      const result = fsrs.calculateCardState(flashcardState, grade);

      expect(result.updatedCardState.difficulty).toBeCloseTo(6.4133, 4);

      expect(result.updatedCardState.stability).toEqual(0.212);

      expect(result.updatedCardState.interval_days).toEqual(0.212);
    });

    it("Initial values for 'Hard' should be close to: difficulty = 5.112171, stability = 1.2931, interval = 1.2931", () => {
      const grade = Grade.Hard;
      const flashcardState = createMockFSRSState();

      const result = fsrs.calculateCardState(flashcardState, grade);

      expect(result.updatedCardState.difficulty).toBeCloseTo(5.112171, 6);

      expect(result.updatedCardState.stability).toEqual(1.2931);

      expect(result.updatedCardState.interval_days).toEqual(1.2931);
    });
  });
});
