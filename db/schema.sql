CREATE TABLE decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    language text,
    user_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)
);

CREATE TABLE cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL,
    front text NOT NULL,
    back text NOT NULL,
    example_sentence text,
    user_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE
);