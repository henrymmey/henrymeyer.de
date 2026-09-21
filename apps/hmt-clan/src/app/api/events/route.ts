import { NextResponse } from "next/server";
import { getVisibleEvents } from "@/lib/events";

export function GET() {
  return NextResponse.json(getVisibleEvents());
}