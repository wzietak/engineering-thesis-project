import { Card } from "@/models/card";

export type Filters = {
  cardId?: string;
  deckId?: string;
  userId?: string
  front?: string;
  back?: string;
  tags?: string[];
};

export interface CardRepository {
  createNewCard: (cardData: Omit<Card, "id">) => Promise<Card>;
  getCards: (userId:string, deckId:string, filters?: Filters) => Promise<Card[]>;
  updateCard: (cardData: Card) => Promise<Card | null>;
  deleteCard: (cardId: string, userId: string) => Promise<void>;
  getCardById: (cardId : string, userId: string) => Promise<Card | null>
}
