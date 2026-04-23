import { db } from "@/db/database";
import { Deck } from "@/models/deck";
import * as Crypto from "expo-crypto";
import { DeckRepository } from "./DeckRepository";

//created additional interface due to differences in data types for is_synced and is_deleted flags
interface DbDeckRow {
  id: string;
  name: string;
  language?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_synced: number;
  is_deleted: number;
}

export class SqliteDeckRepository implements DeckRepository {
  public async createNewDeck(
    deckData: Omit<
      Deck,
      "id" | "created_at" | "updated_at" | "is_synced" | "is_deleted"
    >,
  ): Promise<Deck> {
    const newDeck: Deck = {
      id: Crypto.randomUUID(),
      ...deckData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_synced: false,
      is_deleted: false,
    };

    try {
      await db.runAsync(
        "INSERT INTO decks VALUES($id, $name, $language, $user_id, $created_at, $updated_at, $is_synced, $is_deleted);",
        {
          $id: newDeck.id,
          $name: newDeck.name,
          $language: newDeck.language ?? null,
          $user_id: newDeck.user_id,
          $created_at: newDeck.created_at,
          $updated_at: newDeck.updated_at,
          $is_synced: newDeck.is_synced ? 1 : 0,
          $is_deleted: newDeck.is_deleted ? 1 : 0,
        },
      );
      return newDeck;
    } catch (error: any) {
      if (
        error.message &&
        error.message.includes(
          "UNIQUE constraint failed: decks.name, decks.user_id",
        )
      )
        throw new Error("DECK_NAME_ALREADY EXISTS");
      throw error;
    }
  }

  public async getDecks(userId: string): Promise<Deck[]> {
    const userDecks = await db.getAllAsync<DbDeckRow>(
      "SELECT * FROM decks WHERE user_id = $user_id AND is_deleted = $is_deleted",
      { $user_id: userId, $is_deleted: 0 },
    );

    return userDecks.map((row) => ({
      id: row.id,
      name: row.name,
      language: row.language,
      user_id: row.user_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_synced: row.is_synced === 1 ? true : false,
      is_deleted: row.is_deleted === 1 ? true : false,
    }));
  }

  public async updateDeck(deckData: Deck): Promise<Deck> {
    const result = await db.runAsync(
      "UPDATE decks SET name = $name, language = $language, updated_at = $updated_at, is_synced = $is_synced WHERE id = $id AND user_id = $user_id",
      {
        $id: deckData.id,
        $name: deckData.name,
        $language: deckData.language ?? null,
        $updated_at: new Date().toISOString(),
        $is_synced: 0,
        $user_id: deckData.user_id,
      },
    );
    const updatedDeck: Deck = {
      ...deckData,
      updated_at: new Date().toISOString(),
      is_synced: false,
    };

    return updatedDeck;
  }

  public async deleteDeck(deckId: string, userId: string): Promise<void> {
    const result = await db.runAsync(
      "UPDATE decks SET is_deleted = $is_deleted WHERE id = $id AND user_id = $user_id",
      { $is_deleted: 1, $user_id: userId, $id: deckId },
    );
  }
}
