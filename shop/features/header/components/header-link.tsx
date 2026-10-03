"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderLinkProps = React.ComponentProps<typeof Link> & {
  href: string;
};

export function HeaderLink({ href, ...props }: HeaderLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      {...props}
    />
  );
}
