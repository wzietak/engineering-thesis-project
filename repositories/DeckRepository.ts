import { Deck } from "@/models/deck";

export interface DeckRepository {
  createNewDeck: (
    deckData: Omit<
      Deck,
      "id" | "created_at" | "updated_at" | "is_synced" | "is_deleted"
    >,
  ) => Promise<Deck>;
  getDecks: (userId: string) => Promise<Deck[]>;
  checkIfDeckIsEmpty: (deckId: string) => Promise<boolean>;
  getDeckById: (deckId: string, userId: string) => Promise<Deck | null>;
  updateDeck: (deckData: Deck) => Promise<Deck | null>;
  deleteDeck: (deckId: string, userId: string) => Promise<void>;
}
