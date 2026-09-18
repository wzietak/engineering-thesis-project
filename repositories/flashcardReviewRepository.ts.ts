import { DAY_IN_MILISECONDS } from "@/algorithm/FSRS";
import { FSRSState, localFSRSState } from "@/algorithm/FSRSState";
import { CardDirection, flashcardState, Grade } from "@/algorithm/FSRSTypes";
import { db } from "@/db/database";
import { Card } from "@/models/card";
import { CardType } from "@/models/CardTypes";
import * as Crypto from "expo-crypto";

type reviewDetails = {
  grade: Grade;
  retrievability_at_review: number | null;
  exercise_type: string | null;
  reviewed_at: string;
};

export type ReviewableCard = Pick<
  Card,
  "card_type" | "front" | "back" | "example_sentence"
> &
  FSRSState;

export async function createNewCardState(
  card_id: string,
  card_direction: CardType,
) {
  const newCardState: FSRSState = {
    id: Crypto.randomUUID(),
    card_id: card_id,
    card_direction:
      card_direction === CardType.BASIC
        ? CardDirection.Forward
        : CardDirection.Reverse,
    stability: null,
    difficulty: null,
    last_review: null,
    next_review: null,
    interval_days: null,
    state: flashcardState.New,
    reps: 0,
    lapses: 0,
    updated_at: new Date().toISOString(),
  };

  await db.runAsync(
    "INSERT INTO fsrs_states VALUES ($id, $card_id, $card_direction, $stability, $difficulty, $last_review, $next_review, $interval_days, $state, $reps, $lapses, $updated_at);",
    {
      $id: newCardState.id,
      $card_id: newCardState.card_id,
      $card_direction: newCardState.card_direction,
      $stability: newCardState.stability,
      $difficulty: newCardState.difficulty,
      $last_review: newCardState.last_review,
      $next_review: newCardState.next_review,
      $interval_days: newCardState.interval_days,
      $state: newCardState.state,
      $reps: newCardState.reps,
      $lapses: newCardState.lapses,
      $updated_at: newCardState.updated_at,
    },
  );

  return newCardState;
}

export async function getCardsForReview(userId: string, deckId: string) {
  const filteredCards = await db.getAllAsync(
    "SELECT c.id AS card_id, c.front, c.back, c.example_sentence, f.* FROM cards AS c JOIN fsrs_states AS f ON c.id = f.card_id WHERE  c.user_id = $user_id AND c.deck_id = $deck_id AND c.is_deleted = $is_deleted AND (f.next_review <= $next_review OR f.state = 'New') ORDER BY RANDOM() LIMIT 20;",
    {
      $user_id: userId,
      $deck_id: deckId,
      $is_deleted: 0,
      $next_review: new Date().toISOString(),
    },
  );

  const cardsForReview: ReviewableCard[] = filteredCards.map((row: any) => ({
    ...row,
  }));

  return cardsForReview;
}

export async function saveCardReview(
  previousCardState: FSRSState,
  newCardState: FSRSState,
  reviewDetails: reviewDetails,
) {
  await db.runAsync(
    "UPDATE fsrs_states SET stability = $stability, difficulty = $difficulty, last_review = $last_review, next_review = $next_review, interval_days = $interval_days, state = $state, reps = $reps, lapses = $lapses, updated_at = $updated_at WHERE id = $id",
    {
      $id: newCardState.id,
      $stability: newCardState.stability,
      $difficulty: newCardState.difficulty,
      $last_review: newCardState.last_review,
      $next_review: newCardState.next_review,
      $interval_days: newCardState.interval_days,
      $state: newCardState.state,
      $reps: newCardState.reps,
      $lapses: newCardState.lapses,
      $updated_at: new Date().toISOString(),
    },
  );

  const reviewLog = await db.getFirstAsync<{ id: string }>(
    "INSERT INTO reviews VALUES ($id, $fsrs_state_id, $grade, $previous_stability, $previous_difficulty, $new_stability, $new_difficulty, $previous_state, $retrievability_at_review, $exercise_type, $elapsed_days, $scheduled_days, $reviewed_at) RETURNING id;",
    {
      $id: Crypto.randomUUID(),
      $fsrs_state_id: newCardState.id,
      $grade: reviewDetails.grade,
      $previous_stability: previousCardState.stability,
      $previous_difficulty: previousCardState.difficulty,
      $new_stability: newCardState.stability,
      $new_difficulty: newCardState.difficulty,
      $previous_state: previousCardState.state,
      $retrievability_at_review: reviewDetails.retrievability_at_review,
      $exercise_type: reviewDetails.exercise_type,
      $elapsed_days: previousCardState.last_review
        ? (Date.now() - new Date(previousCardState.last_review).getTime()) /
          DAY_IN_MILISECONDS
        : 0,
      $scheduled_days: newCardState.interval_days,
      $reviewed_at: reviewDetails.reviewed_at,
    },
  );

  return reviewLog?.id;
}

export async function undoCardReview(
  previousCardState: FSRSState,
  reviewId: string,
) {
  await db.runAsync(
    "UPDATE fsrs_states SET stability = $stability, difficulty = $difficulty, last_review = $last_review, next_review = $next_review, interval_days = $interval_days, state = $state, reps = $reps, lapses = $lapses, updated_at = $updated_at WHERE id = $id",
    {
      $id: previousCardState.id,
      $stability: previousCardState.stability,
      $difficulty: previousCardState.difficulty,
      $last_review: previousCardState.last_review,
      $next_review: previousCardState.next_review,
      $interval_days: previousCardState.interval_days,
      $state: previousCardState.state,
      $reps: previousCardState.reps,
      $lapses: previousCardState.lapses,
      $updated_at: new Date().toISOString(),
    },
  );

  await db.runAsync("DELETE FROM reviews WHERE id = $id;", { $id: reviewId });
}

export async function getUnsyncedFSRSStates(
  userId: string,
): Promise<FSRSState[]> {
  const FSRSStates = await db.getAllAsync<localFSRSState>(
    "SELECT * FROM fsrs_states fs JOIN cards c on c.id = fs.card_id WHERE c.user_id = $user_id AND is_synced = $is_synced",
    {
      $user_id: userId,
      $is_synced: 0,
    },
  );
  return FSRSStates.map((row) => ({
    id: row.id,
    card_id: row.card_id,
    card_direction: row.card_direction,
    stability: row.stability,
    difficulty: row.difficulty,
    last_review: row.last_review,
    next_review: row.next_review,
    interval_days: row.interval_days,
    state: row.state,
    reps: row.reps,
    lapses: row.lapses,
    updated_at: row.updated_at,
  }));
}
export async function updateUnsyncedFSRSStates(
  statesToUpsert: any[],
): Promise<void> {
  for (const state of statesToUpsert) {
    await db.runAsync(
      "INSERT INTO fsrs_states (id, card_id,card_direction, stability, difficulty,    last_review, next_review, interval_days,    state, reps, lapses, updated_at, is_synced)VALUES ($id, $card_id, $card_direction, $stability, $difficulty, $last_review, $next_review, $interval_days, $state, $reps, $lapses, $updated_at, $is_synced) ON CONFLICT (id) DO UPDATE SET card_direction = excluded.card_direction, stability = excluded.stability, difficulty = excluded.difficulty,    last_review = excluded.last_review, next_review = excluded.next_review, interval_days = excluded.interval_days,    state = excluded.state, reps = excluded.reps, lapses = excluded.lapses, updated_at = excluded.updated_at, is_synced = excluded.is_synced",
      {
        $id: state.id,
        $card_id: state.card_id,
        $card_direction: state.card_direction,
        $stability: state.stability,
        $difficulty: state.difficulty,
        $last_review: state.last_review,
        $next_review: state.next_review,
        $interval_days: state.interval_days,
        $state: state.state,
        $reps: state.reps,
        $lapses: state.lapses,
        $updated_at: state.updated_at,
        $is_synced: 1,
      },
    );
  }
}

export async function markFSRSStatesAsSynced(
  statesIds: string[],
): Promise<void> {
  for (const stateId of statesIds) {
    await db.runAsync("UPDATE fsrs_states SET is_synced = 1 WHERE id = $id", {
      $id: stateId,
    });
  }
}
