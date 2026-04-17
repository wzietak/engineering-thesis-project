import * as SQLite from "expo-sqlite";

export let db: SQLite.SQLiteDatabase;

export async function initDB() {
  try {
    db = await SQLite.openDatabaseAsync("better-anki.db");
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    const createDecksTableStatement =
      await db.execAsync(`CREATE TABLE IF NOT EXISTS decks (
    id text PRIMARY KEY,
    name text NOT NULL,
    language text,
    user_id text NOT NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    UNIQUE(name, user_id)
);`);

    const createCardsTableStatement =
      await db.execAsync(`CREATE TABLE IF NOT EXISTS cards (
    id text PRIMARY KEY,
    deck_id text NOT NULL,
    front text NOT NULL,
    back text NOT NULL,
    example_sentence text,
    example_source text,
    user_id text NOT NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE
);`);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
