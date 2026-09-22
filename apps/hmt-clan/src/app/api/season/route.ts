import { NextResponse } from "next/server";
import { getSeasons } from "@/lib/season";

export function GET() {
  return NextResponse.json(getSeasons());
}