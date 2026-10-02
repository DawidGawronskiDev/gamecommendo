// Regenerates db/schema.ts and db/relations.ts from the game tables in the
// database. Those two files are generated: never edit them by hand.
// Run with: pnpm db:pull
import { execSync } from "node:child_process";
import { copyFileSync, rmSync } from "node:fs";

const PULL_DIR = "drizzle/pull";

rmSync(PULL_DIR, { recursive: true, force: true });
execSync("drizzle-kit pull", { stdio: "inherit" });
for (const file of ["schema.ts", "relations.ts"]) {
  copyFileSync(`${PULL_DIR}/${file}`, `db/${file}`);
}
// The pull also writes an introspection migration nobody runs.
rmSync(PULL_DIR, { recursive: true, force: true });
console.log("db/schema.ts and db/relations.ts regenerated");
