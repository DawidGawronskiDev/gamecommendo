import { ChromaClient } from "chromadb";

export const client = new ChromaClient({
  host: process.env.CHROMA_HOST ?? "localhost",
  port: Number(process.env.CHROMA_PORT ?? 8000),
});

export const getGamesCollection = async () => {
  return await client.getCollection({ name: "games" });
};

export const getRecommendedGameIds = async (
  gameId: number,
  limit = 6,
  excludedIds: number[] = [],
) => {
  const games = await getGamesCollection();

  const { embeddings } = await games.get({
    ids: [String(gameId)],
    include: ["embeddings"],
  });

  const embedding = embeddings?.[0];
  if (!embedding) return [];

  const { ids } = await games.query({
    queryEmbeddings: [embedding],
    nResults: Math.min(limit + 1 + excludedIds.length, 200),
    include: ["distances"],
  });

  return ids[0]
    .map(Number)
    .filter((id) => id !== gameId && !excludedIds.includes(id))
    .slice(0, limit);
};

const embedQuery = async (query: string) => {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "text-embedding-3-small", input: query }),
  });
  if (!response.ok) {
    throw new Error(`Embedding request failed with ${response.status}`);
  }

  const { data } = (await response.json()) as {
    data: { embedding: number[] }[];
  };

  return data[0].embedding;
};

export const getGameIdsByQuery = async (query: string, limit = 10) => {
  const games = await getGamesCollection();

  const { ids } = await games.query({
    queryEmbeddings: [await embedQuery(query)],
    nResults: limit,
    include: ["distances"],
  });

  return ids[0].map(Number);
};

const cosineDistance = (first: number[], second: number[]) => {
  let dot = 0;
  let firstNorm = 0;
  let secondNorm = 0;
  for (let index = 0; index < first.length; index++) {
    dot += first[index] * second[index];
    firstNorm += first[index] * first[index];
    secondNorm += second[index] * second[index];
  }
  return 1 - dot / Math.sqrt(firstNorm * secondNorm);
};

const BLEND_POOL_PER_QUERY = 80;
const BLEND_DETOUR_WEIGHT = 0.6;

// lean runs from 0 (all the first Game) to 1 (all the second).
export const getBlendedGameIds = async (
  gameIdA: number,
  gameIdB: number,
  lean = 0.5,
  excludedIds: number[] = [],
  limit = 12,
) => {
  const games = await getGamesCollection();

  const picks = await games.get({
    ids: [String(gameIdA), String(gameIdB)],
    include: ["embeddings"],
  });
  const first = picks.embeddings?.[picks.ids.indexOf(String(gameIdA))];
  const second = picks.embeddings?.[picks.ids.indexOf(String(gameIdB))];
  if (!first || !second) return [];

  // One pool for every lean: the Games around each pick and around the middle.
  const midpoint = first.map((value, index) => (value + second[index]) / 2);
  const { ids, embeddings } = await games.query({
    queryEmbeddings: [first, second, midpoint],
    nResults: BLEND_POOL_PER_QUERY,
    include: ["embeddings"],
  });

  const between = cosineDistance(first, second);
  const candidates = new Map<
    number,
    { id: number; position: number; detour: number }
  >();
  ids.forEach((row, queryIndex) => {
    row.forEach((id, index) => {
      const gameId = Number(id);
      if (
        gameId === gameIdA ||
        gameId === gameIdB ||
        excludedIds.includes(gameId)
      ) {
        return;
      }

      const embedding = embeddings[queryIndex][index] as number[];
      const toFirst = cosineDistance(embedding, first);
      const toSecond = cosineDistance(embedding, second);
      candidates.set(gameId, {
        id: gameId,
        // Where the Game sits between the picks, and how far off the line.
        position: toFirst / (toFirst + toSecond),
        detour: toFirst + toSecond - between,
      });
    });
  });

  // No Game sits exactly on a pick, so positions never reach 0 or 1. Stretch
  // the lean over the range the pool really covers, or the ends of the slider
  // would all return the same Games.
  const positions = [...candidates.values()].map(({ position }) => position);
  const nearest = Math.min(...positions);
  const farthest = Math.max(...positions);
  const target = nearest + lean * (farthest - nearest);

  const score = (candidate: { position: number; detour: number }) =>
    Math.abs(candidate.position - target) +
    BLEND_DETOUR_WEIGHT * candidate.detour;

  return [...candidates.values()]
    .sort((a, b) => score(a) - score(b))
    .slice(0, limit)
    .map(({ id }) => id);
};

const SOURCE_LIMIT = 300;
const NEIGHBOURS_PER_SOURCE = 12;

// Every source Game votes for its closest Games; a candidate's score is the
// closeness summed over the sources that point at it.
export const getGameIdsCloseToMany = async (
  sourceIds: number[],
  excludedIds: number[],
  limit = 12,
) => {
  if (!sourceIds.length) return [];

  const games = await getGamesCollection();
  const sources = await games.get({
    ids: sourceIds.slice(0, SOURCE_LIMIT).map(String),
    include: ["embeddings"],
  });
  if (!sources.ids.length || !sources.embeddings) return [];

  const { ids, distances } = await games.query({
    queryEmbeddings: sources.embeddings as number[][],
    nResults: NEIGHBOURS_PER_SOURCE,
    include: ["distances"],
  });

  const excluded = new Set([...sourceIds, ...excludedIds].map(String));
  const candidates = new Map<
    string,
    { score: number; sources: { id: number; closeness: number }[] }
  >();
  ids.forEach((row, sourceIndex) => {
    row.forEach((id, position) => {
      if (excluded.has(id)) return;

      const closeness = 1 - (distances[sourceIndex][position] ?? 1);
      const candidate = candidates.get(id) ?? { score: 0, sources: [] };
      candidate.score += closeness;
      candidate.sources.push({
        id: Number(sources.ids[sourceIndex]),
        closeness,
      });
      candidates.set(id, candidate);
    });
  });

  return [...candidates.entries()]
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, limit)
    .map(([id, candidate]) => ({
      id: Number(id),
      sourceIds: candidate.sources
        .sort((a, b) => b.closeness - a.closeness)
        .map((source) => source.id),
    }));
};
