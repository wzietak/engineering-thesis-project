-- supabase

CREATE TABLE IF NOT EXISTS decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    source_language text,
    target_language text,
    user_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    is_synced INT NOT NULL DEFAULT 0,
    is_deleted INT NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)
);

CREATE TABLE IF NOT EXISTS cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL,
    card_type text NOT NULL,
    front text NOT NULL,
    back text NOT NULL,
    example_sentence text,
    example_source text,
    user_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    is_synced INT NOT NULL DEFAULT 0,
    is_deleted INT NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fsrs_states (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id uuid NOT NULL,
    card_direction text NOT NULL,
    stability DOUBLE PRECISION,
    difficulty DOUBLE PRECISION,
    last_review timestamptz,
    next_review timestamptz,
    interval_days SMALLINT, 
    state TEXT NOT NULL DEFAULT 'New',
    reps SMALLINT NOT NULL DEFAULT 0,
    lapses SMALLINT NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY(card_id) REFERENCES cards(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fsrs_state_id uuid NOT NULL,
    grade SMALLINT NOT NULL,
    previous_stability DOUBLE PRECISION,
    previous_difficulty DOUBLE PRECISION,
    new_stability DOUBLE PRECISION NOT NULL,
    new_difficulty DOUBLE PRECISION NOT NULL,
    previous_state TEXT NOT NULL,
    retrievability_at_review REAL,
    exercise_type TEXT NOT NULL,
    elapsed_days INT NOT NULL,
    scheduled_days SMALLINT NOT NULL,
    reviewed_at timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY(fsrs_state_id) REFERENCES fsrs_states(id)
);

-- SQLite
CREATE TABLE IF NOT EXISTS decks (
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
);

CREATE TABLE IF NOT EXISTS cards (
    id text PRIMARY KEY,
    deck_id text NOT NULL,
    card_type text NOT NULL
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
);

CREATE TABLE IF NOT EXISTS fsrs_states (
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
    FOREIGN KEY(card_id) REFERENCES cards(id)
);

CREATE TABLE IF NOT EXISTS reviews (
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
    FOREIGN KEY(fsrs_state_id) REFERENCES fsrs_states(id)
);