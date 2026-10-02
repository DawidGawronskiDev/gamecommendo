"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { wordmark } from "../data";

type FooterWordmarkProps = React.ComponentProps<"div">;

export function FooterWordmark({ className, ...props }: FooterWordmarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const letters = wordmark.flatMap((part) =>
    [...part.text].map((letter) => ({ letter, className: part.className })),
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("@container w-full select-none", className)}
      {...props}
    >
      <div className="flex overflow-hidden font-heading text-[13.7cqw] leading-[0.82] font-extrabold uppercase">
        {letters.map(({ letter, className }, idx) => (
          <span
            key={idx}
            style={{ transitionDelay: `${idx * 40}ms` }}
            className={cn(
              "transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
              isInView
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0",
              className,
            )}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
