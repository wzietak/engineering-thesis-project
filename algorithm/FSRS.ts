import { FSRSState } from "./FSRSState";
import { FSRS_PARAMETERS, Grade } from "./FSRSTypes";

const DESIRED_RETENTION = 0.9;

export class FSRS {
  private calculateInterval(
    desiredRetention: number = DESIRED_RETENTION,
    stability: number,
  ) {
    const interval =
      (stability / Math.pow(0.9, -1 / FSRS_PARAMETERS[20]) - 1) *
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
          Math.pow(
            stability,
            -FSRS_PARAMETERS[9] *
              (Math.pow(e, FSRS_PARAMETERS[10] * (1 - retrievability)) - 1),
          ));

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
    return initialDifficulty;
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

  public calculateCardState(FSRSState: FSRSState) {}
}
