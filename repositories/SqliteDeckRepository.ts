import { db } from "@/db/database";
import { Deck } from "@/models/deck";
import * as Crypto from "expo-crypto";
import { DeckRepository } from "./DeckRepository";

//created additional interface due to differences in data types for is_synced and is_deleted flags
interface DbDeckRow {
  id: string;
  name: string;
  source_language?: string;
  target_language?: string;
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
        "INSERT INTO decks VALUES($id, $name, $source_language, $target_language, $user_id, $created_at, $updated_at, $is_synced, $is_deleted);",
        {
          $id: newDeck.id,
          $name: newDeck.name,
          $source_language: newDeck.source_language ?? null,
          $target_language: newDeck.target_language ?? null,
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
      source_language: row.source_language,
      target_language: row.target_language,
      user_id: row.user_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_synced: row.is_synced === 1 ? true : false,
      is_deleted: row.is_deleted === 1 ? true : false,
    }));
  }

  public async checkIfDeckIsEmpty(deckId: string): Promise<boolean> {
    const countCards: any = await db.getFirstAsync(
      "SELECT COUNT(*) AS total_cards FROM cards WHERE deck_id = $deck_id AND is_deleted = $is_deleted;",
      { $deck_id: deckId, $is_deleted: 0 },
    );
    return countCards["total_cards"] <= 0;
  }

  public async getDeckById(
    deckId: string,
    userId: string,
  ): Promise<Deck | null> {
    const deck = await db.getFirstAsync<DbDeckRow>(
      "SELECT * FROM decks WHERE user_id = $user_id AND is_deleted = $is_deleted AND id = $id",
      { $user_id: userId, $is_deleted: 0, $id: deckId },
    );

    if (deck !== null) {
      const deckData: Deck = {
        id: deck.id,
        name: deck.name,
        source_language: deck.source_language,
        target_language: deck.target_language,
        user_id: deck.user_id,
        created_at: deck.created_at,
        updated_at: deck.updated_at,
        is_synced: deck.is_synced === 1 ? true : false,
        is_deleted: deck.is_deleted === 1 ? true : false,
      };
      return deckData;
    }

    return null;
  }

  public async updateDeck(
    deckData: Omit<Deck, "created_at" | "updated_at" | "is_synced">,
  ): Promise<Deck | null> {
    const result = await db.runAsync(
      "UPDATE decks SET name = $name, source_language = $source_language, target_language = $target_language, updated_at = $updated_at, is_synced = $is_synced WHERE id = $id AND user_id = $user_id",
      {
        $id: deckData.id,
        $name: deckData.name,
        $target_language: deckData.target_language ?? null,
        $source_language: deckData.source_language ?? null,
        $updated_at: new Date().toISOString(),
        $is_synced: 0,
        $user_id: deckData.user_id,
      },
    );
    return null;
  }

  public async deleteDeck(deckId: string, userId: string): Promise<void> {
    const result = await db.runAsync(
      "UPDATE decks SET is_deleted = $is_deleted WHERE id = $id AND user_id = $user_id",
      { $is_deleted: 1, $user_id: userId, $id: deckId },
    );
  }
}
