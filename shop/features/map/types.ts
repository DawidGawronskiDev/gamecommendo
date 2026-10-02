export type MapNode = [
  id: number,
  x: number,
  y: number,
  name: string,
  cover: string | null,
  year: number | null,
  score: number | null,
  ratingCount: number,
  genreMask: number,
  neighbours: number[],
];

export type MapData = {
  coverPrefix: string;
  genres: string[];
  nodes: MapNode[];
};
