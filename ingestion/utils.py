import os
from datetime import datetime, timedelta
from functools import cache

import psycopg
import requests

from classes.IGDBErrorResponse import IGDBErrorResponse
from classes.TwitchToken import TwitchToken


def get_access_token() -> TwitchToken | IGDBErrorResponse:
    token = requests.post(
        "https://id.twitch.tv/oauth2/token",
        data = {
            "client_id": os.environ["IGDB_CLIENT_ID"],
            "client_secret": os.environ["IGDB_CLIENT_SECRET"],
            "grant_type": "client_credentials"
        },
        timeout=10
    )
    return token.json()


@cache
def get_db() -> psycopg.Connection:
    return psycopg.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        user=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        dbname=os.environ["POSTGRES_DB"],
        autocommit=True
    )


IMAGE_URL = "https://images.igdb.com/igdb/image/upload/{size}/{image_id}.jpg"

# Fields to request from IGDB. The dot syntax expands ids into objects, so no extra requests are needed.
GAME_FIELDS = (
    "name, slug, summary, storyline, url, first_release_date, "
    "rating, rating_count, aggregated_rating, aggregated_rating_count, total_rating, total_rating_count, "
    "cover.image_id, screenshots.image_id, genres.name, platforms.name, player_perspectives.name, "
    "game_modes.name, themes.name, keywords.name, "
    "external_games.uid, external_games.external_game_source"
)

# IGDB's id for Steam in external_game_source.
STEAM_SOURCE = 1

GAME_COLUMNS = (
    "id", "name", "slug", "summary", "storyline", "url", "cover_url", "first_release_date",
    "rating", "rating_count", "aggregated_rating", "aggregated_rating_count", "total_rating", "total_rating_count"
)

# IGDB field -> (junction table, id column). The lookup table is named after the field.
MANY_TO_MANY = {
    "genres": ("game_genres", "genre_id"),
    "platforms": ("game_platforms", "platform_id"),
    "player_perspectives": ("game_player_perspectives", "player_perspective_id"),
    "game_modes": ("game_game_modes", "game_mode_id"),
    "themes": ("game_themes", "theme_id"),
    "keywords": ("game_keywords", "keyword_id"),
}


def apply_schema() -> None:
    """Create any table from init.sql that the database does not have yet. Every statement there is idempotent."""
    with open(os.path.join(os.path.dirname(__file__), "init.sql"), encoding="utf-8") as schema:
        get_db().execute(schema.read())


def fetch_games(headers: dict[str, str], query: str) -> list[dict]:
    """Fetch games from IGDB. query is the Apicalypse part after the fields, e.g. "where rating > 90; limit 10;"."""
    response = requests.post(
        "https://api.igdb.com/v4/games",
        headers=headers,
        data=f"fields {GAME_FIELDS}; {query}",
        timeout=10
    )
    response.raise_for_status()
    return response.json()


def fetch_popular_games(headers: dict[str, str], count: int) -> list[dict]:
    """Fetch the `count` main games (no DLCs, editions or remasters) with the most ratings."""
    games = []
    for offset in range(0, count, 500):  # IGDB returns at most 500 results per request
        games += fetch_games(
            headers,
            f"where game_type = 0 & total_rating_count != null; sort total_rating_count desc; "
            f"limit {min(500, count - offset)}; offset {offset};"
        )
    return games


def _game_row(game: dict) -> tuple:
    cover = game.get("cover")
    release = game.get("first_release_date")
    row = {
        **game,
        "cover_url": IMAGE_URL.format(size="t_cover_big", image_id=cover["image_id"]) if cover else None,
        # IGDB sends a unix timestamp; adding a timedelta also handles dates before 1970
        "first_release_date": (datetime(1970, 1, 1) + timedelta(seconds=release)).date() if release is not None else None,
    }
    return tuple(row.get(column) for column in GAME_COLUMNS)


def save_games(games: list[dict]) -> None:
    """Insert or update games with their screenshots, lookups and junction rows in one transaction."""
    if not games:
        return

    db = get_db()
    game_ids = [game["id"] for game in games]
    # Table and column names below come from the constants above, never from user input.
    with db.transaction(), db.cursor() as cursor:
        updates = ", ".join(f"{column} = EXCLUDED.{column}" for column in GAME_COLUMNS[1:])
        cursor.executemany(
            f"INSERT INTO games ({', '.join(GAME_COLUMNS)}) VALUES ({', '.join(['%s'] * len(GAME_COLUMNS))}) "
            f"ON CONFLICT (id) DO UPDATE SET {updates}",
            [_game_row(game) for game in games]
        )

        # Sync screenshots and junction rows: delete only the ones IGDB removed and insert only new ones,
        # so rows that stay keep their created_at.
        screenshots = [
            (s["id"], game["id"], IMAGE_URL.format(size="t_screenshot_big", image_id=s["image_id"]))
            for game in games for s in game.get("screenshots", [])
        ]
        cursor.execute(
            "DELETE FROM screenshots WHERE game_id = ANY(%s) AND NOT id = ANY(%s)",
            (game_ids, [screenshot_id for screenshot_id, _, _ in screenshots])
        )
        if screenshots:
            cursor.executemany(
                "INSERT INTO screenshots (id, game_id, url) VALUES (%s, %s, %s) "
                "ON CONFLICT (id) DO UPDATE SET game_id = EXCLUDED.game_id, url = EXCLUDED.url",
                screenshots
            )

        for field, (junction, id_column) in MANY_TO_MANY.items():
            items = [(game["id"], item) for game in games for item in game.get(field, [])]
            cursor.execute(
                f"DELETE FROM {junction} WHERE game_id = ANY(%s) "
                f"AND (game_id, {id_column}) NOT IN (SELECT * FROM unnest(%s::int[], %s::int[]))",
                (game_ids, [game_id for game_id, _ in items], [item["id"] for _, item in items])
            )
            if not items:
                continue
            cursor.executemany(
                f"INSERT INTO {field} (id, name) VALUES (%s, %s) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name",
                list({item["id"]: (item["id"], item["name"]) for _, item in items}.values())
            )
            cursor.executemany(
                f"INSERT INTO {junction} (game_id, {id_column}) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                [(game_id, item["id"]) for game_id, item in items]
            )

        # Sync Steam app ids the same way: drop the ones IGDB no longer lists, add the new ones.
        steam_apps = sorted({
            (game["id"], int(external["uid"]))
            for game in games for external in game.get("external_games", [])
            if external.get("external_game_source") == STEAM_SOURCE and str(external.get("uid", "")).isdigit()
        })
        cursor.execute(
            "DELETE FROM game_steam_apps WHERE game_id = ANY(%s) "
            "AND (game_id, steam_app_id) NOT IN (SELECT * FROM unnest(%s::int[], %s::int[]))",
            (game_ids, [game_id for game_id, _ in steam_apps], [app_id for _, app_id in steam_apps])
        )
        if steam_apps:
            cursor.executemany(
                "INSERT INTO game_steam_apps (game_id, steam_app_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                steam_apps
            )
