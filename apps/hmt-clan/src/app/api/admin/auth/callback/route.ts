import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCode,
  toSessionUser,
  type DiscordUser,
} from "@/lib/auth/discord";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";

export const dynamic = "force-dynamic";

const OAUTH_STATE_COOKIE = "hmt_admin_oauth_state";

function redirectTo(request: Request, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const limited = rateLimit(`oauth-callback:${clientIp(request)}`, 10, 60_000);
  if (!limited.ok) {
    return redirectTo(request, "/admin?error=ratelimit");
  }

  // Discord meldet selbst einen Fehler (z. B. abgelehnte Zustimmung).
  if (oauthError) {
    return redirectTo(request, "/admin?error=login");
  }

  const store = await cookies();
  const expectedState = store.get(OAUTH_STATE_COOKIE)?.value;
  store.delete(OAUTH_STATE_COOKIE);

  // CSRF-Schutz: state muss mit dem zuvor gesetzten Cookie uebereinstimmen.
  if (!code || !expectedState || !state || state !== expectedState) {
    return redirectTo(request, "/admin?error=login");
  }

  let discordUser: DiscordUser;
  try {
    discordUser = await exchangeCode(code);
  } catch (error) {
    console.error(
      "[admin] discord oauth exchange failed:",
      error instanceof Error ? error.message : error,
    );
    return redirectTo(request, "/admin?error=login");
  }

  const token = await createSessionToken(toSessionUser(discordUser));
  await setSessionCookie(token);

  return redirectTo(request, "/admin");
}