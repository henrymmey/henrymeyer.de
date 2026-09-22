import { NextResponse } from "next/server";
import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonFromError } from "@/lib/admin/http";
import { discardStagingChanges } from "@/lib/github/github-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  try {
    return NextResponse.json(await discardStagingChanges());
  } catch (error) {
    return jsonFromError(error);
  }
}