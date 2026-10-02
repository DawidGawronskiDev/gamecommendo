# The shop queries Chroma directly

The notebook builds the Chroma collection and the Next.js shop queries the same Chroma server through the official JS client, embedding user Queries server-side with the same model (OpenAI `text-embedding-3-small`). We considered a separate recommendation backend (Express, or a small Python API around the notebook's code) and rejected it: with Chroma running as its own server in Docker, that backend would only forward calls and add a service to maintain.

We also considered replacing Chroma with `pgvector` once the project moved to Postgres: one database, Recommendations as a single SQL query with joins and filters, one less service. We kept Chroma on purpose because learning a dedicated vector database is a goal of this project, not because it is the simpler design. Comparing the two in the notebook later is welcome; switching the shop to `pgvector` would supersede this ADR.

## Consequences

- The shop and the notebook must always use the same embedding model; changing it means rebuilding the whole collection and updating both sides together.
- Chroma returns only Game ids; the shop loads Game details from the database, which stays the only source of truth.
