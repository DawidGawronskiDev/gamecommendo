# Database files

Three schema files, three owners. Keeping them apart is what stops a schema
pull or a migration from breaking the other half.

| File | What it holds | Owner | How it changes |
| --- | --- | --- | --- |
| `schema.ts`, `relations.ts` | Game tables (`games`, lookups, junctions, `game_steam_apps`) | Ingestion (`../../ingestion/init.sql`) | `pnpm db:pull` — generated, never edit by hand |
| `auth-schema.ts` | Better Auth tables (`user`, `session`, `account`, `verification`) | Better Auth | Regenerate with Better Auth's CLI, then `pnpm db:generate` and `pnpm db:migrate` |
| `shop-schema.ts` | Tables the shop owns (`member_steam`, `library_game`, `favourite_game`, `dismissed_game`) | The shop | Edit by hand, then `pnpm db:generate` and `pnpm db:migrate` |

## Rules

- Never edit `schema.ts` or `relations.ts`. The next `pnpm db:pull` overwrites them.
- Never add a shop table to `schema.ts`. `drizzle.config.ts` only pulls the game
  tables listed in its `tablesFilter`; a new game table must be added there.
- Never migrate a game table from the shop. `drizzle.shop.config.ts` only sees
  `auth-schema.ts` and `shop-schema.ts`, so `pnpm db:generate` cannot touch one.
- A shop table that points at a Game stores the Game's id without a foreign key,
  so Ingestion's tables never depend on the shop's.

## Commands

| Command | Does |
| --- | --- |
| `pnpm db:pull` | Regenerates `schema.ts` and `relations.ts` from the game tables in the database |
| `pnpm db:generate --name <name>` | Writes a migration for changes in `auth-schema.ts` / `shop-schema.ts` into `drizzle/shop/` |
| `pnpm db:migrate` | Applies pending migrations from `drizzle/shop/` |
| `pnpm map:build` | Rebuilds `public/game-map.json` from Chroma and Postgres |
| `pnpm catalog:refresh` | Runs the whole refresh in order: ingest, embed, pull, map |

`pnpm catalog:refresh` accepts step names to run only some of them, in the
same fixed order: `pnpm catalog:refresh pull map`.

## Changing a game table

1. Edit `../../ingestion/init.sql` (every statement must stay idempotent; Ingestion
   applies the file on each run).
2. If it is a new table, add it to `tablesFilter` in `drizzle.config.ts`
   (`game_*` is already covered).
3. Run `pnpm catalog:refresh`.
