// Each value has a matching [data-palette] block in app/globals.css.
export const PALETTES = [
  { value: "neutral", label: "Neutral" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "purple", label: "Purple" },
  { value: "amber", label: "Amber" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["value"];

export const DEFAULT_PALETTE: PaletteId = "neutral";

export const PALETTE_STORAGE_KEY = "palette";

export const PALETTE_ATTRIBUTE = "data-palette";
