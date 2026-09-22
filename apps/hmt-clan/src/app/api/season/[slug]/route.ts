import { NextResponse } from "next/server";
import { getSeasonBySlug } from "@/lib/season";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/season/[slug]">,
) {
  const { slug } = await ctx.params;
  const season = getSeasonBySlug(slug);

  if (!season) {
    return NextResponse.json({ error: "Season not found" }, { status: 404 });
  }

  return NextResponse.json(season);
}