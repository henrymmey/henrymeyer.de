import { NextResponse } from "next/server";
import { isMeyerAuthConfigured } from "./meyerauth";
import { getSessionUser, type SessionUser } from "./session";

/** Erlaubte Discord-User-IDs (komma-separiert via .env). */
export function getAllowedUserIds(): string[] {
  const raw = process.env.DISCORD_ALLOWED_USER_IDS ?? "";
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

/** Erlaubte MeyerAuth-E-Mail-Adressen (komma-separiert via .env). */
export function getAllowedEmails(): string[] {
  const raw = process.env.MEYERAUTH_ALLOWED_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isAllowedUser(user: SessionUser): boolean {
  if (user.provider === "meyerauth") {
    const allowed = getAllowedEmails();
    if (allowed.length === 0) {
      return false;
    }
    return user.email ? allowed.includes(user.email.toLowerCase()) : false;
  }
  const allowed = getAllowedUserIds();
  if (allowed.length === 0) {
    return false;
  }
  return allowed.includes(user.id);
}

export function isOAuthConfigured(): boolean {
  return Boolean(
    process.env.DISCORD_CLIENT_ID &&
      process.env.DISCORD_CLIENT_SECRET &&
      process.env.DISCORD_REDIRECT_URI,
  );
}

export { isMeyerAuthConfigured };

export function isGithubConfigured(): boolean {
  return Boolean(process.env.HMT_GITHUB_TOKEN);
}

/**
 * CSRF-Schutz fuer State-Changing-Requests: Wenn der Browser einen
 * `Origin`-Header mitschickt, muss er zum Origin des Requests selbst
 * passen. Request mit fehlendem Origin (z. B. non-browser clients)
 * werden zugelassen; der SameSite=Lax-Cookie schuetzt zusaetzlich.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

type GuardFailure =
  | { error: NextResponse; user: null }
  | { error: null; user: SessionUser };

/**
 * Authentifizierung + Autorisierung fuer jede Admin-API.
 * Prueft Session-Cookie und Provider-Allowlist serverseitig.
 */
export async function guardAdminRequest(
  _request: Request,
): Promise<GuardFailure> {
  void _request;
  const user = await getSessionUser();
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 },
      ),
      user: null,
    };
  }
  if (!isAllowedUser(user)) {
    return {
      error: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      ),
      user: null,
    };
  }
  return { error: null, user };
}

export function requireSameOrigin(
  request: Request,
): NextResponse | null {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Cross-site request rejected" },
      { status: 403 },
    );
  }
  return null;
}