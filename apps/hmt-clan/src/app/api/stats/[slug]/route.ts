import { NextResponse } from "next/server";
import { getThescapeStats, STATS_REVALIDATE_SECONDS } from "@/lib/thescape";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/stats/[slug]">,
) {
  const { slug } = await ctx.params;
  const stats = await getThescapeStats(slug);
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": `public, s-maxage=${STATS_REVALIDATE_SECONDS}, stale-while-revalidate=${STATS_REVALIDATE_SECONDS}`,
    },
  });
}
