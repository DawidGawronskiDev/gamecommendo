"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { UserIcon } from "@phosphor-icons/react";

export function AuthMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <span aria-hidden className="size-9 shrink-0" />;
  }

  const isMember = session !== null;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={isMember ? "Your profile" : "Log in"}
      className="shrink-0"
      render={<Link href={isMember ? "/profile" : "/login"} />}
      nativeButton={false}
    >
      <UserIcon weight={isMember ? "fill" : "regular"} />
    </Button>
  );
}
