# gamecommendo

A fake game shop that recommends Games by meaning. It holds the 10,000 most popular Games from [IGDB](https://www.igdb.com/), turns each one into an embedding, and uses the distance between embeddings to answer "more like this", free-text Queries, Blends of two Games and Recommendations from a Member's Library.

Nothing is sold here: there are no prices, no cart and no checkout. The Catalog exists to lead you into the Recommendations.

![Home page with the Spotlight and the first row of Recommendations](docs/screenshots/home.webp)

## Contents

- [What it does](#what-it-does)
- [How Recommendations work](#how-recommendations-work)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Running it locally](#running-it-locally)
- [Refreshing the Catalog](#refreshing-the-catalog)
- [HTTP API](#http-api)
- [Project layout](#project-layout)
- [Deployment](#deployment)
- [Further reading](#further-reading)
- [Known limits](#known-limits)

## What it does

### Catalog and Product pages

The home page opens with a Spotlight of the most popular Games, followed by rows by Popularity, genre, platform and decade, and a "Players vs critics" row of Games whose Player Score and Critic Score disagree the most.

Every Game has a Product page with its summary, storyline, screenshots, Score and facts, all shown as IGDB provides them.

![Product page for The Witcher 3: Wild Hunt](docs/screenshots/product.webp)

Below the details sit the "more like this" Recommendations: the Games whose Game Profiles are closest in meaning to the one you are looking at.

![Recommendations on a Product page](docs/screenshots/product-recommendations.webp)

### Query: describe what you want to play

Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>⌘</kbd> + <kbd>K</kbd>) anywhere, type what you are in the mood for, and get the Games closest to that description. The Query is embedded with the same model as the Games, so it is matched by meaning rather than by words in the name.

![Query palette answering "cozy farming game with co-op"](docs/screenshots/query.webp)

### Blend: one Game between two others

Pick two Games and get the Recommendation that sits between them in meaning. A slider leans the result toward either pick, and Roll steps through the other candidates.

![Blend of The Witcher 3 and Portal 2](docs/screenshots/blend.webp)

### Map: the whole Catalog in one picture

All 10,000 Games laid out so that Games with close Game Profiles sit near each other. A line joins each Game to its three Neighbours, brighter and larger points are more popular, and a genre can be highlighted. Members see their Library and Favourites marked on it.

![Map of the Catalog](docs/screenshots/map.webp)

### Browse

The full Catalog with search by name and filters for genre, platform, decade and Score. Filters live in the URL, so any view can be linked to.

![Catalog filtered to role-playing Games, sorted by Score](docs/screenshots/browse.webp)

### Members: Library, Favourites, Dismissed and Taste

A visitor can register and become a Member. A Member has:

- a **Library**: the Games they own, imported from Steam by Steam ID or added by hand from a Product page;
- **Favourites**: Games they love, owned or not;
- **Dismissed** Games: left out of every Recommendation, and restorable from the profile;
- a **Taste**: what their Library has more of than the Catalog does.

Library Games and Favourites are outlined across the shop and marked on the Map.

![Member profile showing the Library](docs/screenshots/profile.webp)

A Member with a Library gets a "Recommended for you" row on the home page. Each Recommendation names the owned Games that caused it, and can be dismissed on the spot.

![Recommendations picked from a Member's Library](docs/screenshots/personal-recommendations.webp)

Taste compares the share of each genre, theme and perspective in the Library with its share across the Catalog.

![Taste tab of the profile](docs/screenshots/taste.webp)

### Palettes, Modes and the Design page

The shop can be shown in five Palettes (Neutral, Green, Orange, Purple, Amber), each in a light and a dark Mode. The choice is per browser and changes nothing for anyone else. The `/design` page documents every color token, type style and control, and re-reads its values live as the Palette changes.

![Design page in the Green Palette, light Mode](docs/screenshots/design.webp)

![Home page in the Purple Palette, light Mode](docs/screenshots/palette-purple-light.webp)

### Mobile

<p>
  <img src="docs/screenshots/mobile-home.webp" alt="Home page on a phone" width="300">
  <img src="docs/screenshots/mobile-product.webp" alt="Product page on a phone" width="300">
</p>

## How Recommendations work

1. **Ingestion** fetches the 10,000 main Games with the most ratings from IGDB and stores them in Postgres. DLCs, expansions, editions and remasters are left out.
2. The notebook builds a **Game Profile** for each Game: its summary, followed by its genres, themes and keywords.

   ```
   <summary>
   Genres: Adventure, Role-playing (RPG)
   Themes: Action, Fantasy, Open world
   Keywords: ...
   ```

3. Each Game Profile is embedded with OpenAI `text-embedding-3-small` and stored in a Chroma collection that uses cosine distance.
4. The shop asks Chroma for the nearest Games and loads their details from Postgres. Chroma only ever returns Game ids; Postgres stays the source of truth.

The four kinds of Recommendation all read the same collection (`shop/lib/chroma.ts`):

| Starts from | How it is answered |
| --- | --- |
| A Game ("more like this") | The nearest Games to that Game's embedding. |
| A Query | The Query is embedded with the same model, then the nearest Games are returned. |
| Two Games (a Blend) | A pool is gathered around each pick and around their midpoint. Each candidate is scored by where it sits between the two picks and how far it strays from the line between them; the slider moves the target position. |
| A Member's Library | Every Library Game votes for its closest Games. A candidate's score is the closeness summed over the Games that point at it, which is also how each Recommendation can name the owned Games behind it. |

Recommendations never use IGDB's own `similar_games` list, sales or co-purchase data.

The **Map** is built offline by `shop/scripts/build-game-map.mjs`: it reads every embedding from Chroma, reduces them to two dimensions with UMAP (seeded, so the same data gives the same Map) and writes `shop/public/game-map.json` with each Game's position and three Neighbours.

## Architecture

```
            IGDB API
               │
               ▼
   ┌───────────────────────┐
   │ ingestion/  (Python)  │   the only part that talks to IGDB
   └───────────┬───────────┘
               ▼
   ┌───────────────────────┐        ┌───────────────────────────┐
   │ Postgres              │◄───────│ notebooks/games.ipynb     │
   │  game tables          │        │  Game Profiles ─► OpenAI  │
   │  auth + shop tables   │        └─────────────┬─────────────┘
   └───────────┬───────────┘                      ▼
               │                    ┌───────────────────────────┐
               │                    │ Chroma  (collection       │
               │                    │ "games", cosine distance) │
               │                    └─────────────┬─────────────┘
               ▼                                  ▼
   ┌──────────────────────────────────────────────────────────┐
   │ shop/  (Next.js)                                         │
   │  reads Games from Postgres, Recommendations from Chroma, │
   │  embeds Queries with OpenAI, syncs Libraries from Steam  │
   └──────────────────────────────────────────────────────────┘
```

Three decisions shape the code, each recorded as an ADR in `docs/adr/`:

- **The shop queries Chroma directly.** There is no separate recommendation backend; it would only forward calls. Chroma was kept over `pgvector` on purpose, because learning a dedicated vector database is a goal of the project.
- **Ingestion owns the game schema.** The game tables are defined in `ingestion/init.sql` and written only by Python. The shop generates its Drizzle schema from the live database and never migrates those tables.
- **Three schema files, one owner each.** `schema.ts` (game tables, pulled), `auth-schema.ts` (Better Auth) and `shop-schema.ts` (Library, Favourites, Dismissed) have separate Drizzle configs so that pulling and migrating cannot damage each other.

## Tech stack

| Part | Built with |
| --- | --- |
| Ingestion | Python, `requests`, `psycopg`, IGDB API (Twitch client credentials) |
| Embeddings | Jupyter notebook, `pandas`, `chromadb`, OpenAI `text-embedding-3-small` |
| Data | Postgres 17, Chroma |
| Shop | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui on Base UI |
| Database access | Drizzle ORM and Drizzle Kit |
| Accounts | Better Auth (email and password) |
| Map | `umap-js` at build time |
| Delivery | Docker, GitHub Actions, GitHub Container Registry, Caddy |

## Running it locally

### Prerequisites

- Docker with the Compose plugin
- Python 3.10 or newer (developed on 3.12)
- Node.js 24 and pnpm 11
- IGDB credentials: a Client ID and Client Secret from the [Twitch developer console](https://dev.twitch.tv/console)
- An OpenAI API key (embeds the Catalog once, then one small request per Query)
- A [Steam Web API key](https://steamcommunity.com/dev/apikey), only needed for importing a Library from Steam

### 1. Environment

Two `.env` files are used, and neither is committed.

`.env` in the repository root, read by Docker Compose, Ingestion and the notebook:

```ini
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=

POSTGRES_USER=shop
POSTGRES_PASSWORD=change-me
POSTGRES_DB=shop

OPENAI_API_KEY=
```

`shop/.env`, read by the shop and its scripts:

```ini
DATABASE_URL=postgres://shop:change-me@localhost:5432/shop

OPENAI_API_KEY=
STEAM_API_KEY=

# openssl rand -base64 32
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Optional; these are the defaults.
# CHROMA_HOST=localhost
# CHROMA_PORT=8000
```

### 2. Postgres and Chroma

```sh
docker compose up -d
```

Postgres listens on `5432` and Chroma on `8000`. On its first start Postgres creates the game tables from `ingestion/init.sql`.

### 3. Python environment

The shop's refresh script expects the virtual environment at `.venv` in the repository root.

```sh
python -m venv .venv
.venv/bin/pip install -r ingestion/requirements.txt
.venv/bin/pip install pandas sqlalchemy tqdm chromadb
```

The second line installs what the notebook needs. Add `jupyter` if you want to open the notebook rather than only run it.

### 4. The shop

```sh
cd shop
pnpm install
pnpm db:migrate        # creates the auth and shop-owned tables
pnpm catalog:refresh   # ingest, embed, pull, map (see below)
pnpm dev
```

Open <http://localhost:3000>.

`pnpm catalog:refresh` is the slow step: it fetches 10,000 Games from IGDB and embeds every Game Profile through OpenAI. `shop/public/game-map.json` is committed, so the Map works before you rebuild it.

## Refreshing the Catalog

`pnpm catalog:refresh` (run from `shop/`) runs four steps in the only order that works and stops at the first failure:

| Step | What it does |
| --- | --- |
| `ingest` | IGDB to Postgres. Also creates any new table from `init.sql`. |
| `embed` | Postgres to Chroma, by running the code cells of `notebooks/games.ipynb` without Jupyter. |
| `pull` | Postgres to `db/schema.ts` and `db/relations.ts`. |
| `map` | Chroma and Postgres to `public/game-map.json`. |

Pass step names to run only some of them, still in that order:

```sh
pnpm catalog:refresh pull map
```

The notebook is the only thing that builds the Chroma collection. Besides `games`, it builds a second collection, `games_no_keywords`, to compare Recommendations with and without keywords in the Game Profile; the shop does not use it.

Other scripts in `shop/`:

| Command | Does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js development server, production build, production server |
| `pnpm lint` | ESLint |
| `pnpm db:pull` | Regenerates `schema.ts` and `relations.ts` from the game tables |
| `pnpm db:generate --name <name>` | Writes a migration for changes in `auth-schema.ts` or `shop-schema.ts` |
| `pnpm db:migrate` | Applies pending migrations from `drizzle/shop/` |
| `pnpm map:build` | Rebuilds `public/game-map.json` |

## HTTP API

The shop exposes the stored Games as JSON. Every response has the shape `{ "message": string, "data": Game[] }`.

| Endpoint | Returns |
| --- | --- |
| `GET /api/games` | A page of Games ordered by number of player ratings. |
| `GET /api/games/:id` | The Game with that IGDB id, as a one-element array (empty if there is none). |

`GET /api/games` accepts:

| Parameter | Default | Notes |
| --- | --- | --- |
| `limit` | `10` | Clamped to 1–100. |
| `offset` | `0` | |
| `order` | `asc` | `asc` or `desc`. |

```sh
curl "http://localhost:3000/api/games?limit=5&order=desc"
curl "http://localhost:3000/api/games/1942"
```

## Project layout

```
.
├── CONTEXT.md             domain language (Game, Catalog, Recommendation, ...)
├── docker-compose.yml     Postgres and Chroma for development
├── docs/
│   ├── adr/               architecture decision records
│   └── screenshots/
├── ingestion/             Python: IGDB to Postgres
│   ├── init.sql           the game schema, idempotent
│   ├── main.py            entry point
│   ├── utils.py           fetching and saving Games
│   └── run_notebook.py    runs the notebook's cells without Jupyter
├── notebooks/
│   └── games.ipynb        builds Game Profiles and the Chroma collection
└── shop/                  Next.js app
    ├── app/               routes: /, /browse, /blend, /map, /games/[id], /profile, /design, /api
    ├── features/          one folder per feature (catalog, recommendation, library, taste, ...)
    ├── components/ui/     shared UI primitives
    ├── db/                Drizzle schemas, one owner each (see db/README.md)
    ├── drizzle/           migrations for the auth and shop-owned tables
    ├── lib/               Chroma, Steam, IGDB and auth clients
    ├── scripts/           catalog refresh, schema pull, Map build
    └── deploy/            production Compose file, Caddyfile, .env.example
```

Each folder in `shop/features/` keeps its own `components/`, `queries.ts` and `types.ts`.

## Deployment

The shop runs on a single server with Docker Compose behind Caddy, which obtains and renews the TLS certificate itself. A push to `main` runs CI (type check, lint, build); when it passes, the Deploy workflow builds the image, pushes it to GitHub Container Registry, runs migrations for the shop-owned tables and releases it. Each release is tagged with its commit.

Server setup, GitHub secrets, loading the Catalog on a fresh server, rollbacks and backups are covered in [`shop/DEPLOY.md`](shop/DEPLOY.md).

## Further reading

| Document | About |
| --- | --- |
| [`CONTEXT.md`](CONTEXT.md) | The project's vocabulary. The interface and the code both follow it. |
| [`docs/adr/`](docs/adr) | Why the shop queries Chroma directly, who owns which tables, how Steam games are matched. |
| [`shop/PRODUCT.md`](shop/PRODUCT.md) | Who the shop is for and the principles it holds to. |
| [`shop/DESIGN.md`](shop/DESIGN.md) | The visual system: tokens, Palettes, components. |
| [`shop/db/README.md`](shop/db/README.md) | Rules for the three schema files. |
| [`shop/DEPLOY.md`](shop/DEPLOY.md) | Running it on a server. |

## Known limits

- The Query palette and Steam sync are public endpoints that spend OpenAI and Steam quota, and neither is rate-limited yet.
- There is no password reset or email verification.
- A Steam import matches Games by Steam app id, which covers about 80% of the PC Games in the Catalog. The rest can be added to a Library by hand.
- Any Steam ID is accepted without proof of ownership.
- The shop and the notebook must use the same embedding model. Changing it means rebuilding the whole collection.

## Credits

Game data, covers and screenshots come from [IGDB](https://www.igdb.com/). Game names and artwork belong to their respective owners.
