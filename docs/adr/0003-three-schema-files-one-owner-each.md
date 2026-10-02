# Three schema files, one owner each

The shop's database code is split into `db/schema.ts` (game tables, pulled from the database and never edited), `db/auth-schema.ts` (Better Auth's tables) and `db/shop-schema.ts` (tables the shop owns, such as the Library). Pulling is restricted to the game tables by `tablesFilter` in `drizzle.config.ts`; migrating is restricted to the other two files by a separate `drizzle.shop.config.ts`. We chose this over one schema file and one Drizzle config because the two operations are otherwise destructive to each other: an unfiltered `drizzle-kit pull` copies the auth and shop tables into the generated file, and an unfiltered `drizzle-kit generate` produces a migration that rewrites foreign keys on the game tables, which ADR 0002 forbids.

## Consequences

- `pnpm db:pull` and `pnpm db:generate` / `pnpm db:migrate` are the only supported ways to change these files; `shop/db/README.md` lists the rules.
- A shop table that refers to a Game stores the id without a foreign key, so Ingestion can change or refill its tables without the shop's constraints getting in the way. The shop tolerates ids that no longer resolve.
- Ingestion applies `init.sql` on every run, so a new game table reaches an existing database without recreating the volume.
- `pnpm catalog:refresh` runs ingest, embed (the notebook's cells), pull and map in that order; the notebook remains the only thing that builds the Chroma collection (ADR 0001).
