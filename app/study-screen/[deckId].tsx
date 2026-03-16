import FlashCardContainer from "@/components/flashcard/FlashCardContainer";
import { Card } from "@/models/card";
import { MockCardRepository } from "@/repositories/MockCardRepository";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function studyScreen() {
  const [cardsForToday, setCardsForToday] = useState<Card[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);
  const { deckId } = useLocalSearchParams<{ deckId: string }>();

  useEffect(() => {
    const prepareFlashCards = async () => {
      console.log("Starting useEffect function, my deckId is: ", deckId);

      try {
        const mockCards = new MockCardRepository();
        mockCards.getCards().then((cards) => {
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

  return <FlashCardContainer></FlashCardContainer>;
}
