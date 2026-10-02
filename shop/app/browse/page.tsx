import { Metadata } from "next";
import { redirect } from "next/navigation";

import { BrowseCatalogSection } from "@/features/catalog/components/browse-catalog-section";
import {
  CATALOG_FILTER_PARAMS,
  CATALOG_MIN_SCORES,
  CATALOG_SORTS,
  catalogPageHref,
} from "@/features/catalog/data";
import {
  getCatalogFilterOptions,
  getCatalogPage,
} from "@/features/catalog/queries";
import { CatalogFilters } from "@/features/catalog/types";

export const metadata: Metadata = {
  title: "Browse | gamecommendo",
  description:
    "Browse every Game in the Catalog by name, genre, platform, decade and Score.",
};

type BrowsePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const toPositiveInteger = (value: string | undefined) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const parseCatalogFilters = (params: {
  [key: string]: string | string[] | undefined;
}): CatalogFilters => {
  const get = (key: keyof typeof CATALOG_FILTER_PARAMS) => {
    const value = params[CATALOG_FILTER_PARAMS[key]];
    return Array.isArray(value) ? value[0] : value;
  };

  const minScore = toPositiveInteger(get("minScore"));
  const decade = toPositiveInteger(get("decade"));
  const sort = CATALOG_SORTS.find((item) => item.value === get("sort"));

  return {
    name: (get("name") ?? "").trim().slice(0, 80),
    genreId: toPositiveInteger(get("genreId")),
    platformId: toPositiveInteger(get("platformId")),
    decade: decade && decade % 10 === 0 && decade < 10000 ? decade : null,
    minScore:
      minScore && CATALOG_MIN_SCORES.includes(minScore) ? minScore : null,
    sort: sort?.value ?? "popularity",
    page: Math.min(toPositiveInteger(get("page")) ?? 1, 10000),
  };
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const filters = parseCatalogFilters(await searchParams);
  const [catalogPage, filterOptions] = await Promise.all([
    getCatalogPage(filters),
    getCatalogFilterOptions(),
  ]);

  if (filters.page > catalogPage.pageCount) {
    redirect(catalogPageHref(filters, catalogPage.pageCount));
  }

  return (
    <BrowseCatalogSection
      filters={filters}
      filterOptions={filterOptions}
      catalogPage={catalogPage}
    />
  );
}
