import { DesignToken } from "./types";

// Redefined by every Palette.
export const DESIGN_PALETTE_TOKENS: DesignToken[] = [
  { name: "background", role: "The page" },
  { name: "foreground", role: "Titles and body text" },
  { name: "card", role: "Raised surfaces" },
  { name: "card-foreground", role: "Text on raised surfaces" },
  { name: "popover", role: "Menus and dialogs" },
  { name: "primary", role: "The one primary action" },
  { name: "primary-foreground", role: "Text on the primary action" },
  { name: "secondary", role: "Quiet actions" },
  { name: "muted", role: "Cover placeholders" },
  { name: "muted-foreground", role: "Meta lines and counts" },
  { name: "accent", role: "Hovered and active items" },
  { name: "accent-foreground", role: "Text on hovered items" },
  { name: "border", role: "Hairlines" },
  { name: "input", role: "Field underlines" },
  { name: "ring", role: "Keyboard focus" },
];

// Carry meaning, so no Palette redefines them. They differ by Mode only.
export const DESIGN_FIXED_TOKENS: DesignToken[] = [
  { name: "library", role: "A Game in the Library" },
  { name: "favourite", role: "A Favourite" },
  { name: "destructive", role: "Errors and removal" },
  { name: "score-great", role: "Score of 85 and above" },
  { name: "score-good", role: "Score from 70 to 84" },
  { name: "score-mixed", role: "Score below 70" },
];

// The lowest Score of each tier, with the one just under the last boundary.
export const DESIGN_SCORE_TIERS = [
  { rating: 85, label: "85 and above" },
  { rating: 70, label: "70 to 84" },
  { rating: 69, label: "Below 70" },
];

export const DESIGN_SECTIONS = [
  { id: "design-colors-heading", name: "Colors" },
  { id: "design-meaning-heading", name: "Meaning" },
  { id: "design-type-heading", name: "Type" },
  { id: "design-controls-heading", name: "Controls" },
  { id: "design-games-heading", name: "Games" },
];
