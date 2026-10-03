"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

type ModeToggleProps = React.ComponentProps<"button"> & {
  compact?: boolean;
};

// Drawn as a sibling of the Palette swatches. Icon and label show the current
// Mode through `dark:` classes, so nothing depends on the theme at render.
export function ModeToggle({
  compact = false,
  className,
  ...props
}: ModeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "group flex cursor-pointer flex-col items-center gap-2 outline-none",
        compact ? "w-10" : "w-12",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "grid place-items-center outline-offset-2 outline-ring ring-1 ring-foreground/20 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-focus-visible:outline-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
          compact ? "size-10" : "size-12",
        )}
      >
        <MoonIcon className="hidden size-5 dark:block" />
        <SunIcon className="size-5 dark:hidden" />
      </span>
      <span
        className={cn(
          "text-[0.625rem] leading-none font-semibold tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-foreground",
          compact && "sr-only",
        )}
      >
        <span className="sr-only">Mode: </span>
        <span className="hidden dark:inline">Dark</span>
        <span className="dark:hidden">Light</span>
      </span>
    </button>
  );
}
