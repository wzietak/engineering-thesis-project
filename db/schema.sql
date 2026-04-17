-- supabase

CREATE TABLE IF NOT EXISTS decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    language text,
    user_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    is_synced INT NOT NULL DEFAULT 0,
    is_deleted INT NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)
);

CREATE TABLE IF NOT EXISTS cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL,
    front text NOT NULL,
    back text NOT NULL,
    example_sentence text,
    example_source text,
    user_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    is_synced INT NOT NULL DEFAULT 0,
    is_deleted INT NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- SQLite
CREATE TABLE IF NOT EXISTS decks (
    id text PRIMARY KEY,
    name text NOT NULL,
    language text,
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
