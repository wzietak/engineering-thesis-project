import {
  getCardsForReview,
  ReviewableCard,
  saveCardReview,
  undoCardReview,
} from "@/algorithm/flashcardReviewRepository.ts";
import { FSRS } from "@/algorithm/FSRS";
import { FSRSState } from "@/algorithm/FSRSState";
import { Grade } from "@/algorithm/FSRSTypes";
import AppHeader from "@/components/AppHeader";
import UndoFlashcardButton from "@/components/buttons/UndoFlashcardButton";
import EmptyDeckView from "@/components/EmptyDeckView";
import FlashCardContainer, {
  flashcardRef,
} from "@/components/flashcard/FlashCardContainer";
import FlashcardOptions from "@/components/FlashcardOptions";
import LoadingScreen from "@/components/LoadingScreen";
import Overlay from "@/components/Overlay";
import { AuthContext } from "@/contexts/AuthContext";
import { FrontType } from "@/models/FrontTypes";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { View } from "react-native";

type undoCardData = {
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
  const [isCardReversed, setIsCardReversed] = useState(false);
  const [isUndoInProgress, setIsUndoInProgress] = useState(false);
  const [areFlashcardOptionsVisible, setFlashcardOptionsVisible] =
    useState(false);

  const session = useContext(AuthContext);
  const fsrs = new FSRS();

  const [undoStack, setUndoStack] = useState<undoCardData[]>([]);

  const flashCardContainerRef = useRef<flashcardRef>(null);
  const isUndoingRef = useRef(false);

  const increaseIndex = () => {
    if (currentCardIndex < 0) return;
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
        reviewId: reviewId as string,
        previousFSRSState: previousCardState,
        index: currentCardIndex,
      };

      setUndoStack((prev) => [...prev, undoCardData]);
    } finally {
      setIsDBProcessing(false);
    }
  };

  const handleUndo = async () => {
    if (flashCardContainerRef.current?.isReversed) {
      flashCardContainerRef.current?.showCardFront();
    } else {
      if (currentCardIndex > 0 && undoStack.length > 0) {
        setIsUndoInProgress(true); //flag used to prevent 'undo' icon from blinking during moving between flashcards
        try {
          const previousCardData = undoStack[undoStack.length - 1];
          await undoCardReview(
            previousCardData.previousFSRSState,
            previousCardData.reviewId,
          );
          setCurrentCardIndex(previousCardData.index);
          setUndoStack((prev) => prev.slice(0, -1));
          isUndoingRef.current = true; //function updates the index and sets a flag isUndoingRef
        } catch (error) {
          setIsUndoInProgress(false);
        }
      }
    }
  };

  /* Used separate useEffect for moving from the front of the flashcard to the back of the previous one 
  We can't call flashCardContainerRef.current?.showCardBack() function directly in handleUndo() because setCurrentCardIndex(previousCardData.index) is asynchronous function so it needs time to check index of the current card. UseEffect enables to flip the card after index has been changed to the previous card - isUndoingRef helps with that.
  */
  useEffect(() => {
    if (isUndoingRef.current) {
      flashCardContainerRef.current?.showCardBack();
      isUndoingRef.current = false;
    }
  }, [currentCardIndex]);

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
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader
        title="Study"
        showBack={true}
        goBack={() => {
          router.back();
        }}
        openOptions={() =>
          setFlashcardOptionsVisible(!areFlashcardOptionsVisible)
        }
        undoFlashcard={
          undoStack.length > 0 ||
          isCardReversed ||
          isDBProcessing ||
          isUndoInProgress //isDBProcessing and isUndoInProgres flags help to prevent 'undo' icon from blinking during moving between flashcards - in both directions
            ? () => <UndoFlashcardButton onPress={handleUndo} />
            : undefined
        }
      ></AppHeader>
      <FlashCardContainer
        cardData={cardsForToday[currentCardIndex]}
        onNextCard={increaseIndex}
        onAssessmentButtonPress={onCardAssessment}
        isButtonDisabled={isDBProcessing}
        ref={flashCardContainerRef}
        onCardFlip={(reversed) => {
          setIsCardReversed(reversed);
          if (reversed) {
            setIsUndoInProgress(false);
          }
        }}
      ></FlashCardContainer>

      <Overlay
        visible={areFlashcardOptionsVisible}
        onPress={() => setFlashcardOptionsVisible(false)}
      ></Overlay>

      <FlashcardOptions
        isVisible={areFlashcardOptionsVisible}
        positionTop={95}
        onEditPress={() => {
          router.push({
            pathname: "/add-new-card",
            params: {
              cardId: cardsForToday[currentCardIndex].card_id as string,
            },
          });
          setFlashcardOptionsVisible(false);
        }}
        onDeletePress={() => null}
      ></FlashcardOptions>
    </View>
  );
}
