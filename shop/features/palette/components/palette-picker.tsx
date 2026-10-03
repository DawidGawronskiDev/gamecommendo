"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";
import { PaletteIcon } from "@phosphor-icons/react";

import {
  DEFAULT_PALETTE,
  PALETTE_ATTRIBUTE,
  PALETTE_STORAGE_KEY,
  PALETTES,
  PaletteId,
} from "../data";

type PalettePickerProps = React.ComponentProps<"div"> & {
  compact?: boolean;
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const readPalette = (): PaletteId => {
  try {
    const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
    const palette = PALETTES.find((item) => item.value === stored);
    return palette ? palette.value : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
};

const applyPalette = (palette: PaletteId) =>
  document.documentElement.setAttribute(PALETTE_ATTRIBUTE, palette);

const savePalette = (palette: PaletteId) => {
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, palette);
  } catch {}
  applyPalette(palette);
  listeners.forEach((listener) => listener());
};

export function PalettePicker({
  compact = false,
  className,
  ...props
}: PalettePickerProps) {
  const palette = useSyncExternalStore(
    subscribe,
    readPalette,
    () => DEFAULT_PALETTE,
  );

  // Strict Mode's dev remount resets <html> to its JSX attributes, dropping
  // the one the inline script set. A no-op in production.
  useLayoutEffect(() => applyPalette(readPalette()), []);

  return (
    <div
      className={cn(
        "flex justify-between gap-x-6 gap-y-5",
        compact ? "items-center" : "flex-col sm:flex-row sm:items-center",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <PaletteIcon weight="fill" className="size-6 shrink-0" />
        <p className="flex flex-col text-sm leading-snug">
          <span id="palette-picker-label" className="font-semibold">
            Palette
          </span>
          {!compact && (
            <span className="text-muted-foreground">
              Colors for your view only.
            </span>
          )}
        </p>
      </div>
      <div
        role="radiogroup"
        aria-labelledby="palette-picker-label"
        className={cn("flex", compact ? "gap-2" : "flex-wrap gap-x-3 gap-y-4")}
      >
        {PALETTES.map((item) => (
          <label
            key={item.value}
            className={cn(
              "group flex cursor-pointer flex-col items-center gap-2",
              compact ? "w-10" : "w-12",
            )}
          >
            <input
              type="radio"
              name="palette"
              value={item.value}
              checked={palette === item.value}
              onChange={() => savePalette(item.value)}
              className="peer sr-only"
            />
            {/* Carrying the attribute makes the swatch resolve that Palette's own tokens. */}
            <span
              data-palette={item.value}
              aria-hidden
              className={cn(
                "flex flex-col bg-background text-foreground outline-offset-2 outline-foreground ring-1 ring-foreground/20 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 peer-checked:outline-2 peer-focus-visible:outline-2 peer-focus-visible:outline-ring motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
                compact ? "size-10" : "size-12",
              )}
            >
              <span className="grid flex-1 place-items-center font-heading text-xs leading-none font-extrabold">
                {!compact && "Aa"}
              </span>
              <span className={cn("bg-primary", compact ? "h-3" : "h-4")} />
            </span>
            <span
              className={cn(
                "text-[0.625rem] leading-none font-semibold tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-foreground peer-checked:text-foreground",
                compact && "sr-only",
              )}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
