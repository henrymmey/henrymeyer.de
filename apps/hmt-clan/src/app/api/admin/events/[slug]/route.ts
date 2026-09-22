import { NextResponse } from "next/server";
import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonError, jsonFromError, jsonOk } from "@/lib/admin/http";
import {
  deleteEvent,
  getEventWithMarkdown,
  updateEvent,
} from "@/lib/admin/events";
import { eventPatchSchema } from "@/lib/admin/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/admin/events/[slug]">,
) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const { slug } = await ctx.params;
  try {
    const result = await getEventWithMarkdown(slug);
    if (!result) {
      return jsonError("Event not found.", 404);
    }
    return NextResponse.json(result);
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/events/[slug]">,
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

  const parsed = eventPatchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    const { event } = await updateEvent(slug, parsed.data);
    return jsonOk({ event });
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/admin/events/[slug]">,
) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  const { slug } = await ctx.params;
  try {
    await deleteEvent(slug);
    return jsonOk({});
  } catch (error) {
    return jsonFromError(error);
  }
}