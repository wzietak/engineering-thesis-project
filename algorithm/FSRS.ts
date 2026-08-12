import { FSRSState } from "./FSRSState";
import { flashcardState, FSRS_PARAMETERS, Grade } from "./FSRSTypes";

export const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;

export class FSRS {
  private DESIRED_RETENTION = 0.9;

  private calculateInterval(
    desiredRetention: number = this.DESIRED_RETENTION,
    stability: number,
  ) {
    const interval =
      (stability / (Math.pow(0.9, -1 / FSRS_PARAMETERS[20]) - 1)) *
      (Math.pow(desiredRetention, -1 / FSRS_PARAMETERS[20]) - 1);

    return interval;
  }

  private calculateRetrievability(
    daysSinceLastReview: number,
    stability: number,
  ): number {
    const factor = Math.pow(0.9, -1 / FSRS_PARAMETERS[20]) - 1;
    const retrievability = Math.pow(
      1 + (factor * daysSinceLastReview) / stability,
      -FSRS_PARAMETERS[20],
    );
    return retrievability;
  }

  private calculateInitialStability(grade: Grade): number {
    let stability;
    if (grade === 1) {
      stability = FSRS_PARAMETERS[0];
    } else if (grade === 2) {
      stability = FSRS_PARAMETERS[1];
    } else if (grade === 3) {
      stability = FSRS_PARAMETERS[2];
    } else {
      stability = FSRS_PARAMETERS[3];
    }
    return stability;
  }

  private calculateShortTermStability(stability: number, grade: Grade) {
    const e = Math.E;
    const shortTermStability =
      stability *
      Math.pow(e, FSRS_PARAMETERS[17] * (grade - 3 + FSRS_PARAMETERS[18])) *
      Math.pow(stability, -FSRS_PARAMETERS[19]);

    return shortTermStability;
  }

  private calculateStability(
    stability: number,
    difficulty: number,
    grade: Grade,
    retrievability: number,
  ): number {
    const e = Math.E;
    const w15 = grade === 3 || grade === 4 ? 1 : FSRS_PARAMETERS[15];
    const w16 = grade === 2 || grade === 3 ? 1 : FSRS_PARAMETERS[16];
    const newStability =
      stability *
      (1 +
        w15 *
          w16 *
          Math.pow(e, FSRS_PARAMETERS[8]) *
          (11 - difficulty) *
          Math.pow(stability, -FSRS_PARAMETERS[9]) *
          (Math.pow(e, FSRS_PARAMETERS[10] * (1 - retrievability)) - 1));

    return newStability;
  }

  private calculateStabilityAfterLapse(
    difficulty: number,
    stability: number,
    retrievability: number,
  ): number {
    const e = Math.E;
    const newStability = Math.min(
      stability,
      FSRS_PARAMETERS[11] *
        Math.pow(difficulty, -FSRS_PARAMETERS[12]) *
        (Math.pow(stability + 1, FSRS_PARAMETERS[13]) - 1) *
        Math.pow(e, FSRS_PARAMETERS[14] * (1 - retrievability)),
    );

    return newStability;
  }

  private calculateInitialDifficulty(grade: Grade): number {
    const e = Math.E;
    const initialDifficulty =
      FSRS_PARAMETERS[4] - Math.pow(e, FSRS_PARAMETERS[5] * (grade - 1)) + 1;
    return Math.max(initialDifficulty, 1);
  }

  private calculateDifficulty(grade: Grade, difficulty: number): number {
    const difficultyChange = -FSRS_PARAMETERS[6] * (grade - 3);
    const rawDifficulty =
      difficulty + (difficultyChange * (10 - difficulty)) / 9;
    const newDifficulty =
      FSRS_PARAMETERS[7] * this.calculateInitialDifficulty(4) +
      (1 - FSRS_PARAMETERS[7]) * rawDifficulty;

    return newDifficulty;
  }

  public calculateCardState(card: FSRSState, grade: Grade) {
    let nextStability = card.stability;
    let nextDifficulty = card.difficulty;
    let nextReview = card.next_review;
    let intervalDays = card.interval_days;
    let nextState = card.state;
    let addedLapses = 0;

    let daysSinceLastReview = undefined;
    let retrievability = undefined;

    if (card.last_review) {
      daysSinceLastReview =
        (Date.now() - new Date(card.last_review).getTime()) /
        DAY_IN_MILISECONDS;

      retrievability = this.calculateRetrievability(
        daysSinceLastReview,
        card.stability!,
      );
    }

    if (card.state === flashcardState.New) {
      nextStability = this.calculateInitialStability(grade);
      nextDifficulty = this.calculateInitialDifficulty(grade);
    } else if (daysSinceLastReview! < 1) {
      nextStability = this.calculateShortTermStability(card.stability!, grade);
      nextDifficulty = this.calculateDifficulty(grade, card.difficulty!);
    } else if (grade === Grade.Again) {
      nextStability = this.calculateStabilityAfterLapse(
        card.difficulty!,
        card.stability!,
        retrievability!,
      );
      nextDifficulty = this.calculateDifficulty(grade, card.difficulty!);
      addedLapses = 1;
    } else {
      nextStability = this.calculateStability(
        card.stability!,
        card.difficulty!,
        grade,
        retrievability!,
      );
      nextDifficulty = this.calculateDifficulty(grade, card.difficulty!);
    }

    intervalDays = this.calculateInterval(
      this.DESIRED_RETENTION,
      nextStability,
    );
    nextReview = new Date(
      Date.now() + intervalDays * DAY_IN_MILISECONDS,
    ).toISOString();

    if (
      (card.state === flashcardState.Review ||
        card.state === flashcardState.Relearning) &&
      grade === Grade.Again
    ) {
      nextState = flashcardState.Relearning;
    } else if (intervalDays >= 1) {
      nextState = flashcardState.Review;
    } else if (card.state === flashcardState.New) {
      nextState = flashcardState.Learning;
    }

    const updatedCardState = {
      ...card,
      stability: nextStability,
      difficulty: nextDifficulty,
      last_review: new Date().toISOString(),
      next_review: nextReview,
      interval_days: intervalDays,
      state: nextState,
      reps: card.reps + 1,
      lapses: card.lapses + addedLapses,
    };

    // console.log(updatedCardState);

    return {
      updatedCardState: updatedCardState,
      retrievability: retrievability,
    };
  }
}
