import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCode as exchangeDiscordCode,
  toSessionUser as toDiscordSessionUser,
} from "@/lib/auth/discord";
import { exchangeCode as exchangeMeyerAuthCode } from "@/lib/auth/meyerauth";
import type { SessionUser } from "@/lib/auth/session";
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

  // IdP meldet selbst einen Fehler (z. B. abgelehnte Zustimmung).
  if (oauthError) {
    return redirectTo(request, "/admin?error=login");
  }

  const store = await cookies();
  const rawState = store.get(OAUTH_STATE_COOKIE)?.value;
  store.delete(OAUTH_STATE_COOKIE);

  // CSRF-Schutz: state muss mit dem zuvor gesetzten Cookie uebereinstimmen.
  if (!code || !rawState) {
    return redirectTo(request, "/admin?error=login");
  }

  let expectedState: string | undefined;
  let provider: "discord" | "meyerauth" | undefined;
  let nonce: string | undefined;
  try {
    const parsed = JSON.parse(rawState) as {
      state?: string;
      provider?: string;
      nonce?: string;
    };
    expectedState = parsed.state;
    provider =
      parsed.provider === "meyerauth" || parsed.provider === "discord"
        ? parsed.provider
        : undefined;
    nonce = parsed.nonce;
  } catch {
    provider = undefined;
  }

  if (!expectedState || !state || state !== expectedState || !provider) {
    return redirectTo(request, "/admin?error=login");
  }

  let user: SessionUser;
  try {
    if (provider === "meyerauth") {
      user = await exchangeMeyerAuthCode(code, nonce ?? "");
    } else {
      user = toDiscordSessionUser(await exchangeDiscordCode(code));
    }
  } catch (error) {
    console.error(
      `[admin] ${provider} oauth exchange failed:`,
      error instanceof Error ? error.message : error,
    );
    return redirectTo(request, "/admin?error=login");
  }

  const token = await createSessionToken(user);
  await setSessionCookie(token);

  return redirectTo(request, "/admin");
}