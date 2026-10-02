import { db } from "@/db";
import { games } from "@/db/schema";
import { ApiResponse } from "@/features/api/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<ApiResponse<(typeof games.$inferSelect)[]>> => {
  const id = Number((await params).id);

  if (!Number.isInteger(id)) {
    return NextResponse.json(
      { message: "Invalid game id.", data: [] },
      { status: 400 },
    );
  }

  try {
    const selectedGame = await db.select().from(games).where(eq(games.id, id));

    return NextResponse.json(
      { message: "Games retrieved successfully!", data: selectedGame },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to retrieve games.", data: [] },
      { status: 500 },
    );
  }
};
