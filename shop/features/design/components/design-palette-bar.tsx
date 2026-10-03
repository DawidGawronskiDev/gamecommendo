"use client";

import { useEffect, useRef, useState } from "react";

import { PalettePicker } from "@/features/palette/components/palette-picker";
import { cn } from "@/lib/utils";

type DesignPaletteBarProps = React.ComponentProps<"div">;

// 2.5rem swatches, 0.5rem padding above and below, two hairlines.
const COMPACT_HEIGHT = 58;

export function DesignPaletteBar({
  className,
  ...props
}: DesignPaletteBarProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // The bar is stuck once the line above it has gone under the 3.5rem header.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const bar = barRef.current;
        const isCompact = bar?.dataset.stuck === "true";
        if (bar && !isCompact) setFullHeight(bar.offsetHeight);
        setIsStuck(!entry.isIntersecting);
      },
      { rootMargin: "-57px 0px 0px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden />
      {/* The margin gives back the height the compact bar gives up, so the page below never jumps. */}
      <div
        ref={barRef}
        data-stuck={isStuck}
        style={{ marginBottom: isStuck ? fullHeight - COMPACT_HEIGHT : 0 }}
        className={cn(
          "sticky top-14 z-30 border-y border-foreground/10 bg-background",
          className,
        )}
        {...props}
      >
        <PalettePicker
          compact={isStuck}
          className={cn(
            "mx-auto w-full max-w-[1560px] px-4 md:px-8",
            isStuck ? "py-2" : "py-6",
          )}
        />
      </div>
    </>
  );
}
