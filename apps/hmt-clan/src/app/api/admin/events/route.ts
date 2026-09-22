import { NextResponse } from "next/server";
import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonFromError } from "@/lib/admin/http";
import { createEvent, listEventsWithMarkdown } from "@/lib/admin/events";
import { eventCreateSchema } from "@/lib/admin/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  try {
    const events = await listEventsWithMarkdown();
    return NextResponse.json(events);
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function POST(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = eventCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    const { event } = await createEvent(parsed.data);
    return NextResponse.json({ ok: true, event });
  } catch (error) {
    return jsonFromError(error);
  }
}