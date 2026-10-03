import { PALETTE_ATTRIBUTE, PALETTE_STORAGE_KEY } from "../data";

// Runs while the browser parses <head>, so the stored Palette is on <html>
// before the first paint. An unknown value matches no block and shows Neutral.
const SCRIPT = `(function(){try{var p=localStorage.getItem(${JSON.stringify(PALETTE_STORAGE_KEY)});if(p)document.documentElement.setAttribute(${JSON.stringify(PALETTE_ATTRIBUTE)},p)}catch(e){}})()`;

export function PaletteScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
