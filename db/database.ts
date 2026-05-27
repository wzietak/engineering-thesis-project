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
    source_language text,
    target_language text,
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
    card_type text NOT NULL,
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

    const createFSRSStatesTableStatement =
      await db.execAsync(`CREATE TABLE IF NOT EXISTS fsrs_states (
    id text PRIMARY KEY,
    card_id text NOT NULL,
    card_direction text NOT NULL,
    stability REAL,
    difficulty REAL,
    last_review text,
    next_review text,
    interval_days INTEGER, 
    state TEXT NOT NULL DEFAULT 'New',
    reps INTEGER NOT NULL DEFAULT 0,
    lapses INTEGER NOT NULL DEFAULT 0,
    updated_at text NOT NULL,
    FOREIGN KEY(card_id) REFERENCES cards(id) ON DELETE CASCADE
);`);

    const createReviewsTableStatement =
      await db.execAsync(`CREATE TABLE IF NOT EXISTS reviews (
    id text PRIMARY KEY,
    fsrs_state_id text NOT NULL,
    grade INTEGER NOT NULL,
    previous_stability REAL,
    previous_difficulty REAL,
    new_stability REAL NOT NULL,
    new_difficulty REAL NOT NULL,
    previous_state TEXT NOT NULL,
    retrievability_at_review REAL,
    exercise_type TEXT NOT NULL,
    elapsed_days INTEGER NOT NULL,
    scheduled_days INTEGER NOT NULL,
    reviewed_at text NOT NULL,
    FOREIGN KEY(fsrs_state_id) REFERENCES fsrs_states(id) ON DELETE SET NULL
);`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
