// Builds public/game-map.json: a 2D layout of every Game, placed by the
// meaning of its Game Profile, plus each Game's three closest neighbours.
// Run after Ingestion: node scripts/build-game-map.mjs
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { ChromaClient } from "chromadb";
import pg from "pg";
import { UMAP } from "umap-js";

const NEIGHBORS = 15;
const LINKS = 3;
const COVER_PREFIX = "https://images.igdb.com/igdb/image/upload/t_cover_big/";

// Seeded so the same data always yields the same map.
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const collection = await new ChromaClient({
  host: process.env.CHROMA_HOST ?? "localhost",
  port: Number(process.env.CHROMA_PORT ?? 8000),
}).getCollection({ name: "games" });

const total = await collection.count();
const ids = [];
const embeddings = [];
for (let offset = 0; offset < total; offset += 1000) {
  const page = await collection.get({
    limit: 1000,
    offset,
    include: ["embeddings"],
  });
  ids.push(...page.ids);
  embeddings.push(...page.embeddings);
  console.log(`embeddings ${ids.length}/${total}`);
}

const indexById = new Map(ids.map((id, index) => [id, index]));
const knnIndices = [];
const knnDistances = [];
for (let start = 0; start < ids.length; start += 250) {
  const result = await collection.query({
    queryEmbeddings: embeddings.slice(start, start + 250),
    nResults: NEIGHBORS,
    include: ["distances"],
  });
  result.ids.forEach((row, offset) => {
    const self = start + offset;
    const pairs = row
      .map((id, position) => [
        indexById.get(id),
        result.distances[offset][position],
      ])
      .filter(([index]) => index !== self);
    knnIndices.push(
      [self, ...pairs.map(([index]) => index)].slice(0, NEIGHBORS),
    );
    knnDistances.push(
      [0, ...pairs.map(([, distance]) => distance)].slice(0, NEIGHBORS),
    );
  });
  console.log(`neighbours ${knnIndices.length}/${ids.length}`);
}

const umap = new UMAP({
  nComponents: 2,
  nNeighbors: NEIGHBORS,
  minDist: 0.25,
  random: mulberry32(8),
});
umap.setPrecomputedKNN(knnIndices, knnDistances);
const layout = await umap.fitAsync(embeddings, (epoch) => {
  if (epoch % 50 === 0) console.log(`layout epoch ${epoch}`);
});

const xs = layout.map(([x]) => x);
const ys = layout.map(([, y]) => y);
const [minX, maxX, minY, maxY] = [
  Math.min(...xs),
  Math.max(...xs),
  Math.min(...ys),
  Math.max(...ys),
];
const span = Math.max(maxX - minX, maxY - minY);
const round = (value) => Math.round(value * 10000) / 10000;

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const { rows: genreRows } = await client.query(
  "select id, name from genres order by name",
);
const { rows: gameRows } = await client.query(`
  select g.id, g.name, g.cover_url, g.total_rating, g.total_rating_count,
    extract(year from g.first_release_date)::int as year,
    coalesce(array_agg(gg.genre_id) filter (where gg.genre_id is not null), '{}') as genre_ids
  from games g
  left join game_genres gg on gg.game_id = g.id
  group by g.id
`);
await client.end();

const genreBit = new Map(genreRows.map((genre, bit) => [genre.id, bit]));
const gameById = new Map(gameRows.map((game) => [String(game.id), game]));

// Most popular first, so the client can label and draw in rank order.
const order = ids
  .map((id, index) => ({ index, game: gameById.get(id) }))
  .filter(({ game }) => game)
  .sort(
    (a, b) =>
      (b.game.total_rating_count ?? 0) - (a.game.total_rating_count ?? 0),
  );
const rankByIndex = new Map(order.map(({ index }, rank) => [index, rank]));

const nodes = order.map(({ index, game }) => [
  game.id,
  round((layout[index][0] - minX + (span - (maxX - minX)) / 2) / span),
  round((layout[index][1] - minY + (span - (maxY - minY)) / 2) / span),
  game.name,
  game.cover_url?.startsWith(COVER_PREFIX)
    ? game.cover_url.slice(COVER_PREFIX.length)
    : null,
  game.year,
  game.total_rating == null ? null : Math.round(game.total_rating),
  game.total_rating_count ?? 0,
  game.genre_ids.reduce((mask, id) => mask | (1 << genreBit.get(id)), 0),
  knnIndices[index]
    .slice(1)
    .map((neighbor) => rankByIndex.get(neighbor))
    .filter((rank) => rank !== undefined)
    .slice(0, LINKS),
]);

writeFileSync(
  "public/game-map.json",
  JSON.stringify({
    coverPrefix: COVER_PREFIX,
    genres: genreRows.map((genre) => genre.name),
    nodes,
  }),
);
console.log(`wrote public/game-map.json with ${nodes.length} Games`);
