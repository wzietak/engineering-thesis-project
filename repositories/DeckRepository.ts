import { Deck } from "@/models/deck";

export interface DeckRepository {
  createNewDeck: (deckData: Omit<Deck, "id">) => Promise<Deck>;
  getDecks: () => Promise<Deck[]>;
  updateDeck: (deckData: Deck) => Promise<Deck>;
  deleteDeck: (deckId: number) => Promise<boolean>;
}
