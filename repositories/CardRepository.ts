import { Card } from "@/models/card";

export type Filters = {
  cardId?: number;
  deckId?: number;
  front?: string;
  back?: string;
  tags?: string[];
};

export interface CardRepository {
  createNewCard: (cardData: Omit<Card, "id">) => Promise<Card>;
  getCards: (filters?: Filters) => Promise<Card[]>;
  updateCard: (cardData: Card) => Promise<Card>;
  deleteCard: (cardId: number) => Promise<boolean>;
}
