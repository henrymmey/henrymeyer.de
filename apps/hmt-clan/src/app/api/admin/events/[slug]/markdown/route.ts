import { NextResponse } from "next/server";
import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonError, jsonFromError, jsonOk } from "@/lib/admin/http";
import { getEventMarkdown, putEventMarkdown } from "@/lib/admin/events";
import { markdownPutSchema } from "@/lib/admin/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/admin/events/[slug]/markdown">,
) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const { slug } = await ctx.params;
  try {
    const markdown = await getEventMarkdown(slug);
    return NextResponse.json({ markdown });
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/admin/events/[slug]/markdown">,
) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  const { slug } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = markdownPutSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    await putEventMarkdown(slug, parsed.data.markdown);
    return jsonOk({ markdown: parsed.data.markdown });
  } catch (error) {
    return jsonFromError(error);
  }
}