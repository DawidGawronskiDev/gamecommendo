"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { HeaderLink } from "./header-link";

type HeaderMenuProps = React.ComponentProps<typeof Button> & {
  links: { name: string; href: string }[];
};

export function HeaderMenu({ links, className, ...props }: HeaderMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Menu"
            className={cn(
              "-mr-2.5 focus-visible:border-transparent focus-visible:ring-ring",
              className,
            )}
            {...props}
          />
        }
      >
        <ListIcon className="size-5" />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-0 right-0 left-auto flex h-dvh w-[min(20rem,calc(100%-3rem))] max-w-none translate-x-0 translate-y-0 flex-col gap-0 p-0 duration-200 sm:max-w-none data-open:zoom-in-100 data-open:slide-in-from-right data-closed:zoom-out-100 data-closed:slide-out-to-right motion-reduce:animate-none"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/10 pr-1.5 pl-5">
          <DialogTitle className="font-sans text-xs font-semibold tracking-widest text-muted-foreground">
            Menu
          </DialogTitle>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Close menu"
                className="focus-visible:border-transparent focus-visible:ring-ring"
              />
            }
          >
            <XIcon className="size-5" />
          </DialogClose>
        </div>
        <nav aria-label="Main" className="overflow-y-auto">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-foreground/10">
                <HeaderLink
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-14 items-center px-5 font-heading text-xl leading-none font-extrabold tracking-tighter text-muted-foreground uppercase outline-none transition-colors after:ml-auto after:size-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-[current=page]:text-foreground aria-[current=page]:after:bg-primary"
                >
                  {link.name}
                </HeaderLink>
              </li>
            ))}
          </ul>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
