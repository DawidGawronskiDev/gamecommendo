import { db } from "@/db";
import { games } from "@/db/schema";
import { ApiResponse } from "@/features/api/types";
import { asc, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
): Promise<ApiResponse<(typeof games.$inferSelect)[]>> => {
  try {
    const { limit, order, offset } = handleSearchParams(request);

    const selectedGames = await db
      .select()
      .from(games)
      .limit(limit)
      .offset(offset)
      .orderBy(order(games.ratingCount));

    return NextResponse.json(
      { message: "Games retrieved successfully!", data: selectedGames },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to retrieve games.", data: [] },
      { status: 500 },
    );
  }
};

const handleSearchParams = (request: NextRequest) => {
  const { searchParams } = request.nextUrl;

  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? "10"), 1),
    100,
  );

  const order = searchParams.get("order") === "desc" ? desc : asc;

  const offset = Math.max(Number(searchParams.get("offset") ?? "0"), 0);

  return { limit, order, offset };
};
