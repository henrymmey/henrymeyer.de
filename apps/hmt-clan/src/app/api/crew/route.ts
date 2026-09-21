import { NextResponse } from "next/server";
import { crew } from "@/lib/crew";

export function GET() {
  const members = [...crew].sort((a, b) => a.priority - b.priority);
  return NextResponse.json(members);
}