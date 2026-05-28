import { db } from "@/db/database";
import { Card, ExampleSource } from "@/models/card";
import * as Crypto from "expo-crypto";
import { CardRepository, Filters } from "./CardRepository";

interface DbCardRow {
  id: string;
  deck_id: string;
  card_type: string;
  front: string;
  back: string;
  example_sentence?: string;
  example_source: ExampleSource;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_synced: number;
  is_deleted: number;
  tags: string[];
}

export class SqliteCardRepository implements CardRepository {
  public async createNewCard(
    cardData: Omit<
      Card,
      "id" | "created_at" | "updated_at" | "is_synced" | "is_deleted"
    >,
  ): Promise<Card> {
    const newCard: Card = {
      id: Crypto.randomUUID(),
      ...cardData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_synced: false,
      is_deleted: false,
    };

    try {
      await db.runAsync(
        "INSERT INTO cards VALUES($id, $deck_id, $card_type, $front, $back, $example_sentence, $example_source, $user_id, $created_at, $updated_at, $is_synced, $is_deleted);",
        {
          $id: newCard.id,
          $deck_id: newCard.deck_id,
          $card_type: newCard.card_type,
          $front: newCard.front,
          $back: newCard.back,
          $example_sentence: newCard.example_sentence ?? null,
          $example_source: newCard.example_source ?? null,
          $user_id: newCard.user_id,
          $created_at: newCard.created_at,
          $updated_at: newCard.updated_at,
          $is_synced: newCard.is_synced ? 1 : 0,
          $is_deleted: newCard.is_deleted ? 1 : 0,
        },
      );
      // const testData = await db.getAllAsync("Select * from cards");
      // console.log("BAZA DANYCH - CARDS: ", JSON.stringify(testData, null, 2));
      return newCard;
    } catch (error: any) {
      throw error;
    }
  }

  public async getCards(
    userId: string,
    deckId: string,
    filters?: Filters,
  ): Promise<Card[]> {
    const filteredCards = await db.getAllAsync<DbCardRow>(
      "SELECT * FROM cards WHERE user_id = $user_id AND deck_id = $deck_id AND is_deleted = $is_deleted;",
      { $user_id: userId, $deck_id: deckId, $is_deleted: 0 },
    );

    return filteredCards.map((row) => ({
      id: row.id,
      deck_id: row.deck_id,
      card_type: row.card_type,
      front: row.front,
      back: row.back,
      example_sentence: row.example_sentence ?? "",
      example_source: row.example_source,
      user_id: row.user_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_synced: row.is_synced === 1 ? true : false,
      is_deleted: row.is_deleted === 1 ? true : false,
      tags: row.tags,
    }));
  }

  public async getCardById(
    cardId: string,
    userId: string,
  ): Promise<Card | null> {
    const card = await db.getFirstAsync<DbCardRow>(
      "SELECT * FROM cards WHERE user_id = $user_id AND is_deleted = $is_deleted AND id = $id",
      { $user_id: userId, $is_deleted: 0, $id: cardId },
    );

    if (card !== null) {
      const cardData: Card = {
        id: card.id,
        deck_id: card.deck_id,
        card_type: card.card_type,
        front: card.front,
        back: card.back,
        example_sentence: card.example_sentence ?? "",
        example_source: card.example_source,
        user_id: userId,
        created_at: card.created_at,
        updated_at: card.updated_at,
        is_synced: card.is_synced === 1 ? true : false,
        is_deleted: card.is_deleted === 1 ? true : false,
        tags: card.tags,
      };
      return cardData;
    }

    return null;
  }

  public async updateCard(
    cardData: Omit<Card, "created_at" | "is_synced" | "updated_at">,
  ): Promise<Card | null> {
    const result = await db.runAsync(
      "UPDATE cards SET deck_id = $deck_id, card_type = $card_type, front = $front, back = $back, example_sentence = $example_sentence, example_source = $example_source, updated_at = $updated_at, is_synced = $is_synced WHERE id = $id AND user_id = $user_id;",
      {
        $id: cardData.id,
        $user_id: cardData.user_id,
        $deck_id: cardData.deck_id,
        $card_type: cardData.card_type,
        $front: cardData.front,
        $back: cardData.back,
        $example_sentence: cardData.example_sentence ?? null,
        $example_source: cardData.example_source ?? null,
        $updated_at: new Date().toISOString(),
        $is_synced: 0,
      },
    );

    // const updatedCard: Card = {
    //   ...cardData,
    //   updated_at: new Date().toISOString(),
    //   is_synced: false,
    // };
    return null;
  }

  public async deleteCard(cardId: string, userId: string): Promise<void> {
    const result = await db.runAsync(
      "UPDATE cards SET is_deleted = $is_deleted WHERE id = $id AND user_id = $user_id;",
      { $is_deleted: 1, $user_id: userId, $id: cardId },
    );
  }
}
