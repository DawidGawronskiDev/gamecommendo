"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";
import { DesignToken } from "../types";

type DesignTokenListProps = React.ComponentProps<"ul"> & {
  tokens: DesignToken[];
};

// Palette and Mode both live as attributes on <html>.
const subscribe = (listener: () => void) => {
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-palette"],
  });
  return () => observer.disconnect();
};

let context: CanvasRenderingContext2D | null = null;

// Painting one pixel lets the browser turn any CSS color into sRGB.
const toHex = (color: string) => {
  context ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  if (!context) return color;

  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  const hex = [red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("");

  return alpha === 255 ? `#${hex}` : `#${hex} ${Math.round(alpha / 2.55)}%`;
};

const cache = new Map<string, string>();

const readValues = (names: string) => {
  const root = document.documentElement;
  const key = `${root.className}|${root.dataset.palette}|${names}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const style = getComputedStyle(root);
  const values = names
    .split(",")
    .map((name) => toHex(style.getPropertyValue(`--${name}`).trim()))
    .join(",");
  cache.set(key, values);
  return values;
};

export function DesignTokenList({
  tokens,
  className,
  ...props
}: DesignTokenListProps) {
  const names = tokens.map((token) => token.name).join(",");
  const values = useSyncExternalStore(
    subscribe,
    () => readValues(names),
    () => "",
  ).split(",");

  return (
    <ul
      className={cn("grid gap-x-10 sm:grid-cols-2 2xl:grid-cols-3", className)}
      {...props}
    >
      {tokens.map((token, idx) => (
        <li
          key={token.name}
          className="flex items-center gap-4 border-b border-foreground/10 py-3"
        >
          <span
            aria-hidden
            style={{ backgroundColor: `var(--${token.name})` }}
            className="size-11 shrink-0 ring-1 ring-foreground/15"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate font-heading text-sm leading-snug font-semibold">
              {token.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {token.role}
            </span>
          </span>
          <span className="shrink-0 font-heading text-xs text-muted-foreground uppercase tabular-nums">
            {values[idx]}
          </span>
        </li>
      ))}
    </ul>
  );
}
