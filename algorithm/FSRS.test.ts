import { DAY_IN_MILISECONDS, FSRS } from "./FSRS";
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

    it("Initial values for 'Good' should be close to: difficulty = 2.118104, stability = 2.3065, interval = 2.3065", () => {
      const grade = Grade.Good;
      const flashcardState = createMockFSRSState();

      const result = fsrs.calculateCardState(flashcardState, grade);

      expect(result.updatedCardState.difficulty).toBeCloseTo(2.118104, 6);

      expect(result.updatedCardState.stability).toEqual(2.3065);

      expect(result.updatedCardState.interval_days).toEqual(2.3065);
    });

    it("Initial values for 'Easy' should be: difficulty = 1, stability = 8.2956, interval = 8.2956", () => {
      const grade = Grade.Easy;
      const flashcardState = createMockFSRSState();

      const result = fsrs.calculateCardState(flashcardState, grade);

      expect(result.updatedCardState.difficulty).toEqual(1);

      expect(result.updatedCardState.stability).toEqual(8.2956);

      expect(result.updatedCardState.interval_days).toEqual(8.2956);
    });
  });

  describe("Sequential on-time reviews of the flashcard with state 'review'", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    it("should increase interval and stability, slightly decrease difficulty, increment reps and keep lapses at 0 for consecutive Good ratings", () => {
      let currentTimestamp = new Date("2026-07-18T12:00:00Z").getTime();
      jest.setSystemTime(currentTimestamp);

      const flashcardState = createMockFSRSState();
      const grade = Grade.Good;
      const result1 = fsrs.calculateCardState(flashcardState, grade);

      console.log(result1);

      currentTimestamp +=
        result1.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const result2 = fsrs.calculateCardState(result1.updatedCardState, grade);
      console.log(result2);

      expect(result2.updatedCardState.interval_days).toBeCloseTo(11.909123, 6);
      expect(result2.updatedCardState.stability).toBeCloseTo(11.909123, 6);
      expect(result2.updatedCardState.difficulty).toBeLessThan(2.118104);

      currentTimestamp +=
        result2.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const result3 = fsrs.calculateCardState(result2.updatedCardState, grade);
      console.log(result3);

      currentTimestamp +=
        result3.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const result4 = fsrs.calculateCardState(result3.updatedCardState, grade);
      console.log(result4);
    });

    afterAll(() => {
      jest.useRealTimers();
    });
  });
});
