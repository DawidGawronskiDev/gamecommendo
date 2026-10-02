import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthProfileTabsProps = React.ComponentProps<"nav"> & {
  tabs: { name: string; href: string; count?: number; isCurrent: boolean }[];
};

export function AuthProfileTabs({
  tabs,
  className,
  ...props
}: AuthProfileTabsProps) {
  return (
    <nav
      aria-label="Profile sections"
      className={cn("flex flex-wrap gap-1.5", className)}
      {...props}
    >
      {tabs.map((tab) => (
        <Button
          key={tab.name}
          size="sm"
          variant={tab.isCurrent ? "default" : "outline"}
          aria-current={tab.isCurrent ? "page" : undefined}
          render={<Link href={tab.href} scroll={false} />}
          nativeButton={false}
        >
          {tab.name}
          {tab.count !== undefined && (
            <span className="tabular-nums opacity-70">
              {tab.count.toLocaleString("en-US")}
            </span>
          )}
        </Button>
      ))}
    </nav>
  );
}
