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
      console.log("Hard: ", result1);

      currentTimestamp +=
        result1.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      grade = Grade.Good;

      const result2 = fsrs.calculateCardState(result1.updatedCardState, grade);
      console.log("Good: ", result2);

      expect(result2.updatedCardState.interval_days).toBeGreaterThan(1.2931);
      expect(result2.updatedCardState.stability).toBeGreaterThan(1.2931);
      expect(result2.updatedCardState.difficulty).toBeLessThan(5.112171);

      currentTimestamp +=
        result2.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      jest.setSystemTime(currentTimestamp);

      grade = Grade.Easy;

      const result3 = fsrs.calculateCardState(result2.updatedCardState, grade);
      console.log("Easy: ", result3);

      //   expect(result3.updatedCardState.interval_days).toBeCloseTo(49.631349, 6);
      //   expect(result3.updatedCardState.stability).toBeCloseTo(49.631349, 6);
      //   expect(result3.updatedCardState.difficulty).toBeLessThan(2.116986);

      //   currentTimestamp +=
      //     result3.updatedCardState.interval_days * DAY_IN_MILISECONDS;
      //   jest.setSystemTime(currentTimestamp);

      //   const result4 = fsrs.calculateCardState(result3.updatedCardState, grade);

      //   expect(result4.updatedCardState.interval_days).toBeCloseTo(
      //     173.5842934,
      //     6,
      //   );
      //   expect(result4.updatedCardState.stability).toBeCloseTo(173.5842934, 6);
      //   expect(result4.updatedCardState.difficulty).toBeLessThan(2.115868);
    });

    afterAll(() => {
      jest.useRealTimers();
    });
  });
});
