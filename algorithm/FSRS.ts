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

  private calculateNewStability() {}

  private calculateInitialDifficulty(grade: Grade): number {
    const e = Math.E;
    const initialDifficulty =
      FSRS_PARAMETERS[4] - Math.pow(e, FSRS_PARAMETERS[5] * (grade - 1)) + 1;
    return initialDifficulty;
  }

  public calculateCardState(FSRSState: FSRSState) {}
}
