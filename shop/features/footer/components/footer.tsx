import Link from "next/link";

import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { browseLinks, sourceLinks } from "../data";
import { FooterWordmark } from "./footer-wordmark";

function FooterStatement() {
  return (
    <div className="flex max-w-[34rem] flex-col gap-5">
      <p className="font-heading text-3xl leading-[0.95] font-extrabold tracking-tighter text-balance uppercase lg:text-5xl">
        Nothing here is for sale
      </p>
      <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground lg:text-base">
        gamecommendo is a fake game shop. No prices, no cart, no checkout. It
        exists to show Recommendations matched by meaning.
      </p>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="grid w-full max-w-xs grid-cols-2 gap-10 text-sm lg:text-base">
      <ul className="flex flex-col gap-1.5">
        {browseLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-1.5">
        {sourceLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.name}
              <ArrowUpRightIcon className="size-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterNotes() {
  return (
    <div className="flex flex-col justify-between gap-10 border-t border-foreground/10 pt-8 text-sm leading-relaxed text-muted-foreground lg:flex-row lg:gap-16">
      <p className="max-w-[60ch]">
        <span className="text-foreground">How Recommendations work.</span> Each
        Game&apos;s summary, genres, themes and keywords become one Game
        Profile. Games whose Profiles sit closest in meaning are recommended.
        Not sales, not what other people bought.
      </p>
      <p className="max-w-xs lg:w-full">
        Game data, covers and screenshots come from IGDB. Built with Next.js,
        Postgres and Chroma.
      </p>
    </div>
  );
}

type FooterProps = React.ComponentProps<"footer">;

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-foreground/10 pt-16 pb-6 md:pt-24 md:pb-8",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-14 px-4 md:gap-20 md:px-8">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <FooterStatement />
          <FooterLinks />
        </div>
        <FooterNotes />
        <FooterWordmark />
      </div>
    </footer>
  );
}
