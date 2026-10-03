import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSession } from "@/features/auth/queries";
import { RecommendationQueryCommand } from "@/features/recommendation/components/recommendation-query-command";
import { cn } from "@/lib/utils";
import { PaletteIcon } from "@phosphor-icons/react/dist/ssr";
import { designLink, headerLinks, memberLink, visitorLink } from "../data";
import { HeaderLink } from "./header-link";
import { HeaderMenu } from "./header-menu";

type HeaderProps = React.ComponentProps<"header">;

// Full-height links, so the current one can sit its 2px mark on the hairline.
const linkClassName =
  "inline-flex h-14 items-center border-y-2 border-transparent px-2.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-[current=page]:border-b-primary aria-[current=page]:text-foreground";

export async function Header({ className, ...props }: HeaderProps) {
  const session = await getSession();
  const accountLink = session ? memberLink : visitorLink;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-foreground/10 bg-background",
        className,
      )}
      {...props}
    >
      <a
        href="#main"
        className="sr-only top-1.5 left-4 z-50 bg-primary px-4 py-3 text-xs font-semibold tracking-widest text-primary-foreground uppercase outline-none focus-visible:not-sr-only focus-visible:absolute"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 w-full max-w-[1560px] items-center gap-2 px-4 md:gap-3 md:px-8">
        <Link
          href="/"
          className="flex h-11 shrink-0 items-center font-heading text-lg leading-none font-extrabold tracking-tighter uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          game<span className="text-muted-foreground">commendo</span>
        </Link>
        <nav aria-label="Main" className="hidden md:flex">
          {headerLinks.map((link) => (
            <HeaderLink
              key={link.href}
              href={link.href}
              className={linkClassName}
            >
              {link.name}
            </HeaderLink>
          ))}
        </nav>
        <RecommendationQueryCommand className="flex-1 md:ml-auto md:w-56 md:flex-none lg:w-80 xl:w-96" />
        <Tooltip>
          <TooltipTrigger
            render={
              <HeaderLink
                href={designLink.href}
                aria-label="Design and Palette"
                className={cn(
                  linkClassName,
                  "hidden w-11 justify-center px-0 md:inline-flex",
                )}
              />
            }
          >
            <PaletteIcon className="size-4.5" />
          </TooltipTrigger>
          <TooltipContent side="bottom">Design and Palette</TooltipContent>
        </Tooltip>
        <HeaderLink
          href={accountLink.href}
          className={cn(linkClassName, "hidden md:inline-flex")}
        >
          {accountLink.name}
        </HeaderLink>
        <HeaderMenu
          links={[...headerLinks, designLink, accountLink]}
          className="md:hidden"
        />
      </div>
    </header>
  );
}
