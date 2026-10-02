"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CATALOG_FILTER_PARAMS,
  CATALOG_MIN_SCORES,
  CATALOG_SORTS,
} from "../data";
import { CatalogFilterOptions, CatalogFilters } from "../types";

const ANY = "any";
const NAME_DELAY = 300;

type BrowseCatalogFiltersFieldProps = {
  id: string;
  label: string;
  children: React.ReactNode;
};

function BrowseCatalogFiltersField({
  id,
  label,
  children,
}: BrowseCatalogFiltersFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span
        id={id}
        className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
      >
        {label}
      </span>
      {children}
    </div>
  );
}

type BrowseCatalogFiltersSelectProps = {
  id: string;
  label: string;
  value: string;
  items: { value: string; label: string }[];
  onValueChange: (value: string) => void;
};

function BrowseCatalogFiltersSelect({
  id,
  label,
  value,
  items,
  onValueChange,
}: BrowseCatalogFiltersSelectProps) {
  return (
    <BrowseCatalogFiltersField id={id} label={label}>
      <Select
        items={items}
        value={value}
        onValueChange={(next) => onValueChange(next ?? ANY)}
      >
        <SelectTrigger aria-labelledby={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </BrowseCatalogFiltersField>
  );
}

type BrowseCatalogFiltersProps = React.ComponentProps<"div"> & {
  filters: CatalogFilters;
  filterOptions: CatalogFilterOptions;
};

export function BrowseCatalogFilters({
  filters,
  filterOptions,
  className,
  ...props
}: BrowseCatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(filters.name);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const values: Record<Exclude<keyof CatalogFilters, "page">, string | null> = {
    name: filters.name || null,
    genreId: filters.genreId?.toString() ?? null,
    platformId: filters.platformId?.toString() ?? null,
    decade: filters.decade?.toString() ?? null,
    minScore: filters.minScore?.toString() ?? null,
    sort: filters.sort === "popularity" ? null : filters.sort,
  };
  const hasFilters = Object.values(values).some(Boolean);

  const navigate = (next: Partial<typeof values>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...values, ...next })) {
      if (value) {
        params.set(CATALOG_FILTER_PARAMS[key as keyof typeof values], value);
      }
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const select = (key: keyof typeof values) => (value: string) =>
    navigate({ [key]: value === ANY ? null : value });

  const handleNameChange = (value: string) => {
    setName(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => navigate({ name: value.trim() || null }),
      NAME_DELAY,
    );
  };

  const handleReset = () => {
    clearTimeout(timerRef.current);
    setName("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  };

  return (
    <div
      aria-busy={isPending}
      className={cn("flex flex-col gap-5", className)}
      {...props}
    >
      <BrowseCatalogFiltersField id="browse-name-label" label="Search by name">
        <Input
          type="search"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          placeholder="Portal, Zelda, Doom"
          aria-labelledby="browse-name-label"
          maxLength={80}
        />
      </BrowseCatalogFiltersField>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1">
        <BrowseCatalogFiltersSelect
          id="browse-genre-label"
          label="Genre"
          value={values.genreId ?? ANY}
          items={[
            { value: ANY, label: "Any genre" },
            ...filterOptions.genres.map((genre) => ({
              value: String(genre.id),
              label: genre.name,
            })),
          ]}
          onValueChange={select("genreId")}
        />
        <BrowseCatalogFiltersSelect
          id="browse-platform-label"
          label="Platform"
          value={values.platformId ?? ANY}
          items={[
            { value: ANY, label: "Any platform" },
            ...filterOptions.platforms.map((platform) => ({
              value: String(platform.id),
              label: platform.name,
            })),
          ]}
          onValueChange={select("platformId")}
        />
        <BrowseCatalogFiltersSelect
          id="browse-decade-label"
          label="Decade"
          value={values.decade ?? ANY}
          items={[
            { value: ANY, label: "Any decade" },
            ...filterOptions.decades.map((decade) => ({
              value: String(decade),
              label: `${decade}s`,
            })),
          ]}
          onValueChange={select("decade")}
        />
        <BrowseCatalogFiltersSelect
          id="browse-score-label"
          label="Score"
          value={values.minScore ?? ANY}
          items={[
            { value: ANY, label: "Any Score" },
            ...CATALOG_MIN_SCORES.map((score) => ({
              value: String(score),
              label: `${score} and above`,
            })),
          ]}
          onValueChange={select("minScore")}
        />
        <BrowseCatalogFiltersSelect
          id="browse-sort-label"
          label="Sort by"
          value={filters.sort}
          items={CATALOG_SORTS}
          onValueChange={(value) =>
            navigate({ sort: value === "popularity" ? null : value })
          }
        />
      </div>
      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="self-start"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
