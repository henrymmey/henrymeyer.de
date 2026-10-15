import { NextResponse } from "next/server";
import { getThescapeStats } from "@/lib/thescape";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/stats/[slug]">,
) {
  const { slug } = await ctx.params;
  const stats = await getThescapeStats(slug);
  return NextResponse.json(stats);
}
