import EmptyDeckView from "@/components/EmptyDeckView";
import FlashCardContainer from "@/components/flashcard/FlashCardContainer";
import LoadingScreen from "@/components/LoadingScreen";
import { AuthContext } from "@/contexts/AuthContext";
import {
  getCardsForReview,
  ReviewableCard,
} from "@/repositories/flashcardReviewRepository.ts";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";

export default function studyScreen() {
  // const [cardsForToday, setCardsForToday] = useState<Card[]>([]);
  const [cardsForToday, setCardsForToday] = useState<ReviewableCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const [isDeckEmpty, setIsDeckEmpty] = useState(true);

  const session = useContext(AuthContext);

  const increaseIndex = () => {
    if (currentCardIndex < cardsForToday.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const prepareFlashCards = async () => {
      try {
        const isEmpty = await globalDeckRepository.checkIfDeckIsEmpty(deckId);
        setIsDeckEmpty(isEmpty);
        if (isEmpty) return;
        getCardsForReview(
          session?.currentSession?.user.id as string,
          deckId,
        ).then((cards) => {
          const readyCards = cards as ReviewableCard[];
          setCardsForToday(readyCards);
        });
      } catch (error) {
        console.error("Error while getting cards data.");
      } finally {
        setIsLoading(false);
      }
    };
    prepareFlashCards();
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
    ></FlashCardContainer>
  );
}
