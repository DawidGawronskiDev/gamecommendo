import type { getTaste } from "./queries";

export type TasteResult = Awaited<ReturnType<typeof getTaste>>;

export type Taste = NonNullable<TasteResult["taste"]>;

export type TasteDimension = Taste["dimensions"][number];
