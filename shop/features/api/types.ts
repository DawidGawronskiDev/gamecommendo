import { NextResponse } from "next/server";

export type ApiResponse<T> = NextResponse<{
  message: string;
  data: T;
}>;
