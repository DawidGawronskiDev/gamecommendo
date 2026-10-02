# Ingestion owns the game schema; the shop only reads it

The game tables (games, lookups, junction tables) are defined in `init.sql` and written only by the Python Ingestion. The Next.js shop generates its Drizzle schema from the existing database with `drizzle-kit pull` and never migrates these tables. We chose this over moving the whole schema into Drizzle migrations so the Python side does not depend on the shop's tooling and can create and fill the database on its own.

## Consequences

- Changing a game table means editing `init.sql`, then re-running `drizzle-kit pull` in the shop.
- Tables the shop adds later for its own features (customers, wishlists) are owned by Drizzle migrations, never by `init.sql`.
