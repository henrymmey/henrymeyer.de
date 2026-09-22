import { NextResponse } from "next/server";
import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonFromError, jsonOk } from "@/lib/admin/http";
import { createSeason, readAllSeasons } from "@/lib/admin/seasons";
import { seasonCreateSchema } from "@/lib/admin/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  try {
    const { seasons } = await readAllSeasons();
    const sorted = [...seasons].sort((a, b) => a.priority - b.priority);
    return NextResponse.json(sorted);
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

  const parsed = seasonCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    const { season } = await createSeason(parsed.data);
    return jsonOk({ season });
  } catch (error) {
    return jsonFromError(error);
  }
}