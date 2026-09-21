import { NextResponse } from "next/server";
import { getCrewMemberBySlug } from "@/lib/crew";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/crew/[slug]">,
) {
  const { slug } = await ctx.params;
  const member = getCrewMemberBySlug(slug);

  if (!member) {
    return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}