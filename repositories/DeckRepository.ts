import { Deck } from "@/models/deck";

export interface DeckRepository {
  createNewDeck: (deckData: Omit<Deck, "id">) => Promise<Deck>;
  getDecks: (userId: string) => Promise<Deck[]>;
  updateDeck: (deckData: Deck) => Promise<Deck>;
  deleteDeck: (deckId: string, userId: string) => Promise<void>;
}
