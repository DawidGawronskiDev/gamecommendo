"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { SignOutIcon } from "@phosphor-icons/react";

type AuthAccountProps = React.ComponentProps<"div"> & {
  name: string;
  email: string;
};

export function AuthAccount({
  name,
  email,
  className,
  ...props
}: AuthAccountProps) {
  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="font-heading text-3xl leading-none font-extrabold tracking-tighter text-balance uppercase md:text-5xl">
          {name}
        </h1>
        <p className="truncate text-sm text-muted-foreground">{email}</p>
      </div>
      <Button variant="outline" onClick={handleLogOut} className="self-start">
        <SignOutIcon />
        Log out
      </Button>
    </div>
  );
}
