import { NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/auth";
import { jsonFromError } from "@/lib/admin/http";
import { getOverview } from "@/lib/admin/overview";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  try {
    const overview = await getOverview();
    return NextResponse.json(overview);
  } catch (error) {
    return jsonFromError(error);
  }
}