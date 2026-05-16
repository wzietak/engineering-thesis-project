import { State } from "react-native-gesture-handler";
import { ExerciseType, Grade } from "./FSRSTypes";

export interface ReviewLog {
  id: string;
  fsrs_state_id: string;
  grade: Grade;
  previous_stability: number;
  previous_difficulty: number;
  new_stability: number;
  new_difficulty: number;
  previous_state: State;
  retrievability_at_review: number;
  exercise_type: ExerciseType;
  elapsed_days: number;
  scheduled_days: number;
  reviewed_at: string;
}
