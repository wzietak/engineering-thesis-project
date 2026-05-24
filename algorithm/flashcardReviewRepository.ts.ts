import { DAY_IN_MILISECONDS } from "@/algorithm/FSRS";
import { FSRSState } from "@/algorithm/FSRSState";
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

  //   const testData = await db.getAllAsync("Select * from fsrs_states");
  //   console.log("BAZA DANYCH: ", JSON.stringify(testData, null, 2));
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

  // const testData = await db.getAllAsync("Select * from reviews");
  // console.log("BAZA DANYCH  - REVIEWS: ", JSON.stringify(testData, null, 2));

  // const testData2 = await db.getAllAsync("Select * from fsrs_states");
  // console.log(
  //   "BAZA DANYCH - FSRS STATES: ",
  //   JSON.stringify(testData2, null, 2),
  // );

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
