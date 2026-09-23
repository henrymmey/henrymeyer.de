import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import {
  getAuthorizeUrl as getDiscordAuthorizeUrl,
  OAuthNotConfiguredError,
} from "@/lib/auth/discord";
import {
  getAuthorizeUrl as getMeyerAuthAuthorizeUrl,
  isMeyerAuthConfigured,
  MeyerAuthNotConfiguredError,
} from "@/lib/auth/meyerauth";
import { isOAuthConfigured } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";
import { jsonError } from "@/lib/admin/http";

export const dynamic = "force-dynamic";

const OAUTH_STATE_COOKIE = "hmt_admin_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;

const PROVIDERS = ["discord", "meyerauth"] as const;
type Provider = (typeof PROVIDERS)[number];

function isProvider(value: string | null): value is Provider {
  return value !== null && (PROVIDERS as readonly string[]).includes(value);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const providerParam = url.searchParams.get("provider");
  const provider: Provider = isProvider(providerParam) ? providerParam : "discord";

  if (provider === "discord" && !isOAuthConfigured()) {
    return jsonError("Discord OAuth is not configured.", 503);
  }
  if (provider === "meyerauth" && !isMeyerAuthConfigured()) {
    return jsonError("MeyerAuth OIDC is not configured.", 503);
  }

  const limited = rateLimit(`oauth-login:${clientIp(request)}`, 10, 60_000);
  if (!limited.ok) {
    return jsonError("Too many login attempts. Try again later.", 429);
  }

  const state = randomUUID();
  const nonce = provider === "meyerauth" ? randomUUID() : null;
  const store = await cookies();
  store.set(
    OAUTH_STATE_COOKIE,
    JSON.stringify({ state, provider, nonce }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/admin/auth",
      maxAge: STATE_TTL_SECONDS,
    },
  );

  try {
    if (provider === "meyerauth") {
      return NextResponse.redirect(
        await getMeyerAuthAuthorizeUrl(state, nonce!),
      );
    }
    return NextResponse.redirect(getDiscordAuthorizeUrl(state));
  } catch (error) {
    if (error instanceof OAuthNotConfiguredError) {
      return jsonError("Discord OAuth is not configured.", 503);
    }
    if (error instanceof MeyerAuthNotConfiguredError) {
      return jsonError("MeyerAuth OIDC is not configured.", 503);
    }
    throw error;
  }
}