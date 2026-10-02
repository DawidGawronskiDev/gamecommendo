// Refreshes everything that depends on the Catalog, in the only order that
// works. Stops at the first step that fails. Run with: pnpm catalog:refresh
//
//   1. ingest   IGDB -> Postgres (also creates any new table from init.sql)
//   2. embed    Postgres -> Chroma, by running the notebook's cells
//   3. pull     Postgres -> db/schema.ts, db/relations.ts
//   4. map      Chroma + Postgres -> public/game-map.json
import { execSync } from "node:child_process";

const PYTHON = "../.venv/bin/python";

const steps = [
  ["ingest", `${PYTHON} main.py`, "../ingestion"],
  ["embed", `${PYTHON} ingestion/run_notebook.py`, ".."],
  ["pull", "node scripts/db-pull.mjs", "."],
  ["map", "node scripts/build-game-map.mjs", "."],
];

const only = process.argv.slice(2);
for (const [name, command, cwd] of steps) {
  if (only.length && !only.includes(name)) continue;

  console.log(`\n== ${name}: ${command}`);
  execSync(command, { cwd, stdio: "inherit" });
}
console.log("\nCatalog refreshed");
