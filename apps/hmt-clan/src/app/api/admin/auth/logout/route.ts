import { deleteSessionCookie } from "@/lib/auth/session";
import { requireSameOrigin } from "@/lib/auth";
import { jsonOk } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  await deleteSessionCookie();
  return jsonOk({});
}