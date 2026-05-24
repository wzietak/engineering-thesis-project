import {
  getCardsForReview,
  ReviewableCard,
  saveCardReview,
} from "@/algorithm/flashcardReviewRepository.ts";
import { FSRS } from "@/algorithm/FSRS";
import { FSRSState } from "@/algorithm/FSRSState";
import { Grade } from "@/algorithm/FSRSTypes";
import undoFlashcardButton from "@/components/buttons/UndoFlashcardButton";
import EmptyDeckView from "@/components/EmptyDeckView";
import FlashCardContainer from "@/components/flashcard/FlashCardContainer";
import LoadingScreen from "@/components/LoadingScreen";
import { AuthContext } from "@/contexts/AuthContext";
import { FrontType } from "@/models/FrontTypes";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";

type undoCardData = {
  fsrsId: string;
  reviewId: string;
  previousFSRSState: FSRSState;
  index: number;
};

export async function handleCardAssessment(
  grade: Grade,
  previousCardState: FSRSState,
  fsrs: FSRS,
) {
  const { updatedCardState, retrievability } = fsrs.calculateCardState(
    previousCardState,
    grade,
  );
  const reviewId = await saveCardReview(previousCardState, updatedCardState, {
    grade: grade,
    retrievability_at_review: retrievability ? retrievability : null,
    exercise_type: FrontType.STANDARD,
    reviewed_at: new Date().toISOString(),
  });

  return {
    reviewId: reviewId,
    previousFSRSState: previousCardState,
  };
}

export default function studyScreen() {
  const [cardsForToday, setCardsForToday] = useState<ReviewableCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const [isDeckEmpty, setIsDeckEmpty] = useState(true);
  const [isDBProcessing, setIsDBProcessing] = useState<boolean>(false);

  const session = useContext(AuthContext);
  const fsrs = new FSRS();
  const navigation = useNavigation();

  const [undoStack, setUndoStack] = useState<undoCardData[]>([]);

  const increaseIndex = () => {
    if (currentCardIndex < cardsForToday.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      router.back();
    }
  };

  const onCardAssessment = async (grade: Grade) => {
    if (isDBProcessing) return;
    setIsDBProcessing(true);

    try {
      const previousCardState: FSRSState = {
        id: cardsForToday[currentCardIndex].id,
        card_id: cardsForToday[currentCardIndex].card_id,
        card_direction: cardsForToday[currentCardIndex].card_direction,
        stability: cardsForToday[currentCardIndex].stability,
        difficulty: cardsForToday[currentCardIndex].difficulty,
        last_review: cardsForToday[currentCardIndex].last_review,
        next_review: cardsForToday[currentCardIndex].next_review,
        interval_days: cardsForToday[currentCardIndex].interval_days,
        state: cardsForToday[currentCardIndex].state,
        reps: cardsForToday[currentCardIndex].reps,
        lapses: cardsForToday[currentCardIndex].lapses,
        updated_at: cardsForToday[currentCardIndex].updated_at,
      };

      const { reviewId } = await handleCardAssessment(
        grade,
        previousCardState,
        fsrs,
      );

      const undoCardData: undoCardData = {
        fsrsId: cardsForToday[currentCardIndex].id,
        reviewId: reviewId as string,
        previousFSRSState: previousCardState,
        index: currentCardIndex,
      };

      setUndoStack((prev) => [...prev, undoCardData]);
    } finally {
      setIsDBProcessing(false);
    }
  };

  /* 
  Used 3 different booleans: isLoading, !deckId and isMounted.
  They all prevents app from null exceptions when user moves too fast between decks.
  1) isLoading - in case DB needs more time to get all flashcards and loading screen should be showed so the user knows that he has to wait
  2) !deckId check - in case React Nvigation needs more time to pass the parameter
  3) isMounted - prevents unfinished queries if the user quickly navigates back before the DB promise resolves
  */
  useEffect(() => {
    let isMounted = true;
    if (!deckId) return;
    const prepareFlashCards = async () => {
      try {
        if (!isMounted) return;
        const isEmpty = await globalDeckRepository.checkIfDeckIsEmpty(deckId);
        setIsDeckEmpty(isEmpty);
        if (isEmpty) return;
        getCardsForReview(
          session?.currentSession?.user.id as string,
          deckId,
        ).then((cards) => {
          const readyCards = cards as ReviewableCard[];
          if (!isMounted) return;
          setCardsForToday(readyCards);
        });
      } finally {
        setIsLoading(false);
        navigation.setOptions({ undoFlashcard: undoFlashcardButton });
      }
    };
    prepareFlashCards();
    setUndoStack([]);

    return () => {
      isMounted = false;
    };
  }, [deckId]);

  if (isLoading) {
    return <LoadingScreen></LoadingScreen>;
  }
  if (isDeckEmpty) {
    return <EmptyDeckView></EmptyDeckView>;
  }
  if (cardsForToday.length === 0) {
    return <EmptyDeckView noMoreCardsToReview={true}></EmptyDeckView>;
  }

  return (
    <FlashCardContainer
      cardData={cardsForToday[currentCardIndex]}
      onNextCard={increaseIndex}
      onAssessmentButtonPress={onCardAssessment}
      isButtonDisabled={isDBProcessing}
    ></FlashCardContainer>
  );
}
