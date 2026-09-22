import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { getAuthorizeUrl, OAuthNotConfiguredError } from "@/lib/auth/discord";
import { isOAuthConfigured } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";
import { jsonError } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

const OAUTH_STATE_COOKIE = "hmt_admin_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;

export async function GET(request: Request) {
  if (!isOAuthConfigured()) {
    return jsonError("Discord OAuth is not configured.", 503);
  }

  const limited = rateLimit(`oauth-login:${clientIp(request)}`, 10, 60_000);
  if (!limited.ok) {
    return jsonError("Too many login attempts. Try again later.", 429);
  }

  const state = randomUUID();
  const store = await cookies();
  store.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/admin/auth",
    maxAge: STATE_TTL_SECONDS,
  });

  try {
    return NextResponse.redirect(getAuthorizeUrl(state));
  } catch (error) {
    if (error instanceof OAuthNotConfiguredError) {
      return jsonError("Discord OAuth is not configured.", 503);
    }
    throw error;
  }
}