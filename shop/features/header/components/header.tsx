import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { AuthMenu } from "@/features/auth/components/auth-menu";
import { cn } from "@/lib/utils";
import { RecommendationQueryCommand } from "@/features/recommendation/components/recommendation-query-command";

type HeaderProps = React.ComponentProps<"header">;

export function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-foreground/10 bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1560px] items-center justify-between gap-3 px-4 sm:gap-4 md:px-8">
        <Link
          href="/"
          className="font-heading text-lg leading-none font-extrabold tracking-tighter uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          game<span className="text-muted-foreground">commendo</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-5">
          <Link
            href="/browse"
            className="hidden text-xs font-semibold tracking-widest text-muted-foreground uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:inline"
          >
            Browse
          </Link>
          <Link
            href="/blend"
            className="text-xs font-semibold tracking-widest text-muted-foreground uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Blend
          </Link>
          <Link
            href="/map"
            className="hidden text-xs font-semibold tracking-widest text-muted-foreground uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:inline"
          >
            Map
          </Link>
        </nav>
        <RecommendationQueryCommand />
        <ModeToggle />
        <AuthMenu />
      </div>
    </header>
  );
}
