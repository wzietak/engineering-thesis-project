import { Card } from "@/models/card";
import { CardRepository, Filters } from "./CardRepository";

export class MockCardRepository implements CardRepository {
  private static counter = 6;
  private cardsArray: Card[] = [
    {
      id: 1,
      deckId: 1,
      cardType: "two-sided",
      front: "talerz",
      back: "plate",
      usageExample: "He was invited to a party and asked to bring a plate.",
      exampleSource: "user",
      tags: ["basic", "home"],
    },
    {
      id: 2,
      deckId: 1,
      cardType: "two-sided",
      front: "piłka",
      back: "ball",
      usageExample:
        "Imagine playing a round of golf with one ball — lose it and the game is over.",
      exampleSource: "user",
      tags: ["basic"],
    },
    {
      id: 3,
      deckId: 1,
      cardType: "two-sided",
      front: "plate",
      back: "talerz",
      usageExample: "He was invited to a party and asked to bring a plate.",
      exampleSource: "user",
      tags: ["basic", "home"],
    },
    {
      id: 4,
      deckId: 1,
      cardType: "two-sided",
      front: "ball",
      back: "piłka",
      usageExample:
        "Imagine playing a round of golf with one ball — lose it and the game is over.",
      exampleSource: "user",
      tags: ["basic"],
    },
    {
      id: 5,
      deckId: 2,
      cardType: "one-sided",
      front: "kot",
      back: "cat",
      usageExample: "I love watching my cat sleeping.",
      exampleSource: "user",
      tags: ["basic", "home"],
    },
    {
      id: 6,
      deckId: 2,
      cardType: "one-sided",
      front: "pies",
      back: "dog",
      usageExample: "My dog always sleep with me.",
      exampleSource: "user",
      tags: ["basic"],
    },
  ];

  public createNewCard(cardData: Omit<Card, "id">): Promise<Card> {
    return new Promise<Card>((resolve) => {
      setTimeout(() => {
        const newCard: Card = {
          id: (MockCardRepository.counter += 1),
          ...cardData,
        };
        this.cardsArray.push(newCard);
        resolve(newCard);
      }, 500);
    });
  }

  public getCards(filters?: Filters): Promise<Card[]> {
    return new Promise<Card[]>((resolve) => {
      setTimeout(() => {
        resolve(this.cardsArray);
      }, 500);
    });
  }

  public updateCard(cardData: Card): Promise<Card> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.cardsArray.findIndex(
          (card) => card.id == cardData.id,
        );
        if (index === -1) {
          reject(new Error("Card with given ID not found."));
          return;
        } else {
          this.cardsArray[index] = { ...this.cardsArray[index], ...cardData };
          resolve(this.cardsArray[index]);
        }
      }, 500);
    });
  }

  public deleteCard(cardId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.cardsArray.findIndex((card) => card.id == cardId);
        if (index === -1) {
          reject(new Error("Card with given ID not found."));
          return;
        } else {
          this.cardsArray.splice(index, 1);
          resolve(true);
        }
      }, 500);
    });
  }
}
