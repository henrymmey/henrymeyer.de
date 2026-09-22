import { NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/auth";
import { jsonFromError } from "@/lib/admin/http";
import { getStagingStatus } from "@/lib/github/github-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  try {
    return NextResponse.json(await getStagingStatus());
  } catch (error) {
    return jsonFromError(error);
  }
}
