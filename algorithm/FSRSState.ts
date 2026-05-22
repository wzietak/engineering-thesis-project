import { CardDirection, flashcardState } from "./FSRSTypes";

export interface FSRSState {
  id: string;
  card_id: string;
  card_direction: CardDirection;
  stability: number;
  difficulty: number;
  last_review: string;
  next_review: string;
  interval_days: number;
  state: flashcardState;
  reps: number;
  lapses: number;
  updated_at: string;
}
