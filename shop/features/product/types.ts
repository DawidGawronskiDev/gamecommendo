import type { getProductById } from "./queries";

export type ProductForDetail = NonNullable<
  Awaited<ReturnType<typeof getProductById>>
>;
