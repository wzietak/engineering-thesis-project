import { CardDirection, flashcardState } from "./FSRSTypes";

export interface FSRSState {
  id: string;
  card_id: string;
  card_direction: CardDirection;
  stability: number | null;
  difficulty: number | null;
  last_review: string | null;
  next_review: string | null;
  interval_days: number | null;
  state: flashcardState;
  reps: number;
  lapses: number;
  updated_at: string;
}
