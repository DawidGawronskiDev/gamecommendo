import os

from dotenv import load_dotenv

from utils import apply_schema, fetch_popular_games, get_access_token, save_games


def main():
    load_dotenv()
    apply_schema()

    access_token = get_access_token()

    if "access_token" not in access_token:
        raise RuntimeError(f"Failed to get access token: {access_token['message']}")

    headers = {
        "Client-ID": os.environ["IGDB_CLIENT_ID"],
        "Authorization": f"Bearer {access_token['access_token']}"
    }

    games = fetch_popular_games(headers, 10000)
    save_games(games)
    print(f"Saved {len(games)} games")


if __name__ == "__main__":
    main()
