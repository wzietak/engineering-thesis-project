import EmptyDeckView from "@/components/EmptyDeckView";
import FlashCardContainer from "@/components/flashcard/FlashCardContainer";
import LoadingScreen from "@/components/LoadingScreen";
import { Card } from "@/models/card";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function studyScreen() {
  const [cardsForToday, setCardsForToday] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { deckId } = useLocalSearchParams<{ deckId: string }>();

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
        await globalCardRepository.getCards().then((cards) => {
          const filteredCards = cards.filter(
            (card) => card.deckId === Number(deckId),
          );
          setCardsForToday(filteredCards);
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
  if (cardsForToday.length === 0) {
    return <EmptyDeckView></EmptyDeckView>;
  }

  return (
    <FlashCardContainer
      cardData={cardsForToday[currentCardIndex]}
      onNextCard={increaseIndex}
    ></FlashCardContainer>
  );
}
