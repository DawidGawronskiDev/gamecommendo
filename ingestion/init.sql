-- Runs automatically on the first `docker compose up` (empty database volume).
-- To apply it again: docker compose down -v && docker compose up -d

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    summary TEXT,
    storyline TEXT,
    url VARCHAR(255),
    cover_url VARCHAR(255),
    first_release_date DATE,
    rating DOUBLE PRECISION,
    rating_count INTEGER,
    aggregated_rating DOUBLE PRECISION,
    aggregated_rating_count INTEGER,
    total_rating DOUBLE PRECISION,
    total_rating_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A screenshot belongs to exactly one game, so it references the game directly.
CREATE TABLE IF NOT EXISTS screenshots (
    id INTEGER PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lookup tables: IGDB id -> name, shared between games.

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_perspectives (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_modes (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS themes (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction tables: which game has which genre, platform, etc.

CREATE TABLE IF NOT EXISTS game_genres (
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS game_platforms (
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    platform_id INTEGER NOT NULL REFERENCES platforms (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, platform_id)
);

CREATE TABLE IF NOT EXISTS game_player_perspectives (
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    player_perspective_id INTEGER NOT NULL REFERENCES player_perspectives (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, player_perspective_id)
);

CREATE TABLE IF NOT EXISTS game_game_modes (
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    game_mode_id INTEGER NOT NULL REFERENCES game_modes (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, game_mode_id)
);

CREATE TABLE IF NOT EXISTS game_themes (
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    theme_id INTEGER NOT NULL REFERENCES themes (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, theme_id)
);

CREATE TABLE IF NOT EXISTS game_keywords (
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    keyword_id INTEGER NOT NULL REFERENCES keywords (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, keyword_id)
);

-- Keep updated_at current. The WHEN clause skips updates that change nothing,
-- so re-running Ingestion only bumps rows whose IGDB data actually changed.

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY ARRAY['games', 'screenshots', 'genres', 'platforms', 'player_perspectives', 'game_modes', 'themes', 'keywords', 'game_genres', 'game_platforms', 'game_player_perspectives', 'game_game_modes', 'game_themes', 'game_keywords'] LOOP
        EXECUTE format(
            'CREATE OR REPLACE TRIGGER set_updated_at BEFORE UPDATE ON %I '
            'FOR EACH ROW WHEN (OLD IS DISTINCT FROM NEW) EXECUTE FUNCTION set_updated_at()',
            table_name
        );
    END LOOP;
END;
$$;

-- Steam app ids of a game, taken from IGDB's external games. A game can have several
-- (re-releases, regional versions), and the shop uses them to match a Steam library.
CREATE TABLE IF NOT EXISTS game_steam_apps (
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    steam_app_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, steam_app_id)
);

CREATE INDEX IF NOT EXISTS game_steam_apps_steam_app_id_idx ON game_steam_apps (steam_app_id);
