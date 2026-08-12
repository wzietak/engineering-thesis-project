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
    stability: overrides?.stability ?? null,
    difficulty: overrides?.difficulty ?? null,
    last_review: overrides?.last_review ?? null,
    next_review: overrides?.next_review ?? null,
    interval_days: overrides?.interval_days ?? null,
    state: overrides?.state ?? flashcardState.New,
    reps: overrides?.reps ?? 0,
    lapses: overrides?.lapses ?? 0,
    updated_at: fixedDate,
  };
}

describe("FSRS algorithm", () => {
  describe("Flashcard first review", () => {
    it("Initial values for 'Again' should be: difficulty = 6.4133, stability = 0.212, interval = 0.212; card state should be 'Learning'", () => {
      const grade = Grade.Again;

      const cardState = createMockFSRSState();

      const result = fsrs.calculateCardState(cardState, grade);

      expect(result.updatedCardState.difficulty).toBeCloseTo(6.4133, 4);

      expect(result.updatedCardState.stability).toEqual(0.212);

      expect(result.updatedCardState.interval_days).toEqual(0.212);

      expect(result.updatedCardState.state).toBe(flashcardState.Learning);
    });

    it("Initial values for 'Hard' should be close to: difficulty = 5.112171, stability = 1.2931, interval = 1.2931; card state should be 'Review'", () => {
      const grade = Grade.Hard;
      const cardState = createMockFSRSState();

      const result = fsrs.calculateCardState(cardState, grade);

      expect(result.updatedCardState.difficulty).toBeCloseTo(5.112171, 6);

      expect(result.updatedCardState.stability).toEqual(1.2931);

      expect(result.updatedCardState.interval_days).toEqual(1.2931);

      expect(result.updatedCardState.state).toBe(flashcardState.Review);
    });

    it("Initial values for 'Good' should be close to: difficulty = 2.118104, stability = 2.3065, interval = 2.3065; card state should be 'Review'", () => {
      const grade = Grade.Good;
      const cardState = createMockFSRSState();

      const result = fsrs.calculateCardState(cardState, grade);

      expect(result.updatedCardState.difficulty).toBeCloseTo(2.118104, 6);

      expect(result.updatedCardState.stability).toEqual(2.3065);

      expect(result.updatedCardState.interval_days).toEqual(2.3065);

      expect(result.updatedCardState.state).toBe(flashcardState.Review);
    });

    it("Initial values for 'Easy' should be: difficulty = 1, stability = 8.2956, interval = 8.2956; card state should be 'Review'", () => {
      const grade = Grade.Easy;
      const cardState = createMockFSRSState();

      const result = fsrs.calculateCardState(cardState, grade);

      expect(result.updatedCardState.difficulty).toEqual(1);

      expect(result.updatedCardState.stability).toEqual(8.2956);

      expect(result.updatedCardState.interval_days).toEqual(8.2956);

      expect(result.updatedCardState.state).toBe(flashcardState.Review);
    });
  });

  describe("Sequential on-time reviews of the flashcard", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    it("should increase interval and stability, slightly decrease difficulty, increment reps and keep lapses at 0 for consecutive Good ratings", () => {
      let currentTimestamp = new Date("2026-07-18T12:00:00Z").getTime();
      jest.setSystemTime(currentTimestamp);

      const flashcardState = createMockFSRSState();
      const grade = Grade.Good;
      const result1 = fsrs.calculateCardState(flashcardState, grade);

      currentTimestamp +=
        result1.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const result2 = fsrs.calculateCardState(result1.updatedCardState, grade);

      expect(result2.updatedCardState.interval_days).toBeCloseTo(11.909123, 6);
      expect(result2.updatedCardState.stability).toBeCloseTo(11.909123, 6);
      expect(result2.updatedCardState.difficulty).toBeLessThan(2.118104);
      expect(result2.updatedCardState.reps).toBe(2);

      currentTimestamp +=
        result2.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const result3 = fsrs.calculateCardState(result2.updatedCardState, grade);

      expect(result3.updatedCardState.interval_days).toBeCloseTo(49.631349, 6);
      expect(result3.updatedCardState.stability).toBeCloseTo(49.631349, 6);
      expect(result3.updatedCardState.difficulty).toBeLessThan(2.116986);
      expect(result3.updatedCardState.reps).toBe(3);

      currentTimestamp +=
        result3.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const result4 = fsrs.calculateCardState(result3.updatedCardState, grade);

      expect(result4.updatedCardState.interval_days).toBeCloseTo(
        173.5842934,
        6,
      );
      expect(result4.updatedCardState.stability).toBeCloseTo(173.5842934, 6);
      expect(result4.updatedCardState.difficulty).toBeLessThan(2.115868);
      expect(result4.updatedCardState.reps).toBe(4);
    });

    it("should dynamically adjust values for mixed ratings: Hard increases difficulty, Good stabilazes, and Easy significantly increases interval and lowers difficulty", () => {
      let currentTimestamp = new Date("2026-07-18T12:00:00Z").getTime();
      jest.setSystemTime(currentTimestamp);

      const flashcardState = createMockFSRSState();
      let grade = Grade.Hard;
      const result1 = fsrs.calculateCardState(flashcardState, grade);

      expect(result1.updatedCardState.difficulty).toBeGreaterThan(5);

      currentTimestamp +=
        result1.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      grade = Grade.Good;

      const result2 = fsrs.calculateCardState(result1.updatedCardState, grade);

      expect(result2.updatedCardState.interval_days).toBeGreaterThan(1.2931);
      expect(result2.updatedCardState.stability).toBeGreaterThan(1.2931);
      expect(result2.updatedCardState.difficulty).toBeLessThan(5.112171);

      currentTimestamp +=
        result2.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      grade = Grade.Easy;

      const result3 = fsrs.calculateCardState(result2.updatedCardState, grade);

      expect(result3.updatedCardState.interval_days).toBeGreaterThan(
        5.22306 * 2,
      );
      expect(result3.updatedCardState.stability).toBeGreaterThan(5.22306 + 10);
      expect(result3.updatedCardState.difficulty).toBeLessThan(5.108059);
    });

    afterAll(() => {
      jest.useRealTimers();
    });
  });

  describe("Forgetting and relearning scenarios", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    it("should transition mature cards to Relearning and drop stability more severely for a high-difficulty card than a low-difficulty card upon an Again rating", () => {
      let currentTimestamp = new Date("2026-07-18T12:00:00Z").getTime();
      const grade = Grade.Again;

      const matureFlashcardHighDiff = createMockFSRSState({
        state: flashcardState.Review,
        stability: 10.0,
        interval_days: 10.0,
        difficulty: 8.0,
        reps: 8,
        last_review: new Date(currentTimestamp).toISOString(),
      });

      const matureFlashcardLowDiff = createMockFSRSState({
        state: flashcardState.Review,
        stability: 10.0,
        interval_days: 10.0,
        difficulty: 3.0,
        reps: 8,
        last_review: new Date(currentTimestamp).toISOString(),
      });

      currentTimestamp +=
        matureFlashcardHighDiff.interval_days! * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const resultHighDiff = fsrs.calculateCardState(
        matureFlashcardHighDiff,
        grade,
      );

      const resultLowDiff = fsrs.calculateCardState(
        matureFlashcardLowDiff,
        grade,
      );

      expect(resultHighDiff.updatedCardState.stability).toBeLessThan(
        resultLowDiff.updatedCardState.stability,
      );
      expect(resultHighDiff.updatedCardState.stability).toBeLessThan(
        matureFlashcardHighDiff.stability! / 2,
      );
      expect(resultLowDiff.updatedCardState.stability).toBeLessThan(
        matureFlashcardLowDiff.stability! / 2,
      );

      expect(resultLowDiff.updatedCardState.state).toBe(
        flashcardState.Relearning,
      );
      expect(resultHighDiff.updatedCardState.state).toBe(
        flashcardState.Relearning,
      );

      expect(resultLowDiff.updatedCardState.lapses).toBe(1);
      expect(resultHighDiff.updatedCardState.lapses).toBe(1);
    });

    it("should keep the card in Relearning, increment lapses (when interval is equal or longer than 1 day), and apply diminishing stability penalties upon consecutive Again ratings", () => {
      let currentTimestamp = new Date("2026-07-18T12:00:00Z").getTime();
      const grade = Grade.Again;

      const matureFlashcard = createMockFSRSState({
        state: flashcardState.Review,
        stability: 10.0,
        interval_days: 10.0,
        difficulty: 4.5,
        reps: 8,
        last_review: new Date(currentTimestamp).toISOString(),
      });

      currentTimestamp += matureFlashcard.interval_days! * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const firstReview = fsrs.calculateCardState(matureFlashcard, grade);
      console.log("first review with Again: ", firstReview);

      expect(firstReview.updatedCardState.state).toBe(
        flashcardState.Relearning,
      );
      expect(firstReview.updatedCardState.lapses).toBe(1);
      expect(firstReview.updatedCardState.difficulty).toBeGreaterThan(
        matureFlashcard.difficulty! * 1.5,
      );
      expect(firstReview.updatedCardState.stability).toBeLessThan(
        matureFlashcard.stability! / 2,
      );

      currentTimestamp += 2 * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      const secondReview = fsrs.calculateCardState(
        firstReview.updatedCardState,
        grade,
      );
      console.log("second review with Again: ", secondReview);

      expect(secondReview.updatedCardState.state).toBe(
        flashcardState.Relearning,
      );
      expect(secondReview.updatedCardState.lapses).toBe(2);
      expect(secondReview.updatedCardState.difficulty).toBeGreaterThanOrEqual(
        9,
      );
      expect(secondReview.updatedCardState.difficulty).toBeLessThan(10);
      expect(secondReview.updatedCardState.stability).toBeLessThan(
        firstReview.updatedCardState.stability,
      );

      const firstStabilityDrop =
        matureFlashcard.stability! - firstReview.updatedCardState.stability;
      const secondStabilityDrop =
        firstReview.updatedCardState.stability -
        secondReview.updatedCardState.stability;

      expect(secondStabilityDrop).toBeLessThan(firstStabilityDrop);
    });

    it("should transition the card from Relearning back to Review and increase stability upon a positive rating", () => {});

    afterAll(() => {
      jest.useRealTimers();
    });
  });
});
