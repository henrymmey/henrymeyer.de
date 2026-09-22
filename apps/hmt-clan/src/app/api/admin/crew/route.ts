import { NextResponse } from "next/server";
import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonFromError, jsonOk } from "@/lib/admin/http";
import {
  createMember,
  readAllMembers,
  reorderMembers,
} from "@/lib/admin/crew";
import {
  crewCreateSchema,
  crewReorderSchema,
} from "@/lib/admin/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  try {
    const { members } = await readAllMembers();
    const sorted = [...members].sort((a, b) => a.priority - b.priority);
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

  const parsed = crewCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    const { member } = await createMember(parsed.data);
    return jsonOk({ member });
  } catch (error) {
    return jsonFromError(error);
  }
}

/** Reihenfolge der Crew-Mitglieder neu setzen (ein Commit). */
export async function PUT(request: Request) {
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

  const parsed = crewReorderSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    const members = await reorderMembers(parsed.data.order);
    return jsonOk({ members });
  } catch (error) {
    return jsonFromError(error);
  }
}