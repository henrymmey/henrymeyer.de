import { NextResponse } from "next/server";
import { getVisibleEvents } from "@/lib/events";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/events/[slug]">,
) {
  const { slug } = await ctx.params;
  const event = getVisibleEvents().find((e) => e.slug === slug);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}