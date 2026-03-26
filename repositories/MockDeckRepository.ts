import { Deck } from "@/models/deck";
import { DeckRepository } from "./DeckRepository";

export class MockDeckRepository implements DeckRepository {
  private static counter = 6;
  private decksArray: Deck[] = [
    { id: 1, name: "Angielski A2", language: "English" },
    { id: 2, name: "Business English", language: "English" },
    { id: 3, name: "Spanish" },
    { id: 4, name: "Business English", language: "English" },
    { id: 5, name: "Englissh", language: "English" },
    { id: 6, name: "Chinese" },
  ];

  public createNewDeck(deckData: Omit<Deck, "id">): Promise<Deck> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newDeck: Deck = { id: (MockDeckRepository.counter += 1), ...deckData };
        if (newDeck != null) {
          this.decksArray.push(newDeck)
          resolve(newDeck);
        } else {
          reject(new Error("Couldn't create a new deck."));
          return;
        }
      }, 500);
    });
  }

  public getDecks(): Promise<Deck[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.decksArray);
      }, 500);
    });
  }

  public updateDeck(deckData: Deck): Promise<Deck> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.decksArray.findIndex(
          (deck) => deck.id == deckData.id,
        );
        if (index === -1) {
          reject(new Error("Deck with given ID not found."));
          return;
        }
        this.decksArray[index] = { ...this.decksArray[index], ...deckData };
        resolve(this.decksArray[index]);
      }, 500);
    });
  }

  public deleteDeck(deckId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.decksArray.findIndex((deck) => deck.id == deckId);
        if (index === -1) {
          reject(new Error("Deck with given ID not found."));
          return;
        }
        this.decksArray.splice(index, 1);
        resolve(true);
      }, 500);
    });
  }
}
