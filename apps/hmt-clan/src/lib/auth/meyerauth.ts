import { createHash } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { SessionUser } from "./session";

export class MeyerAuthNotConfiguredError extends Error {
  constructor() {
    super("MeyerAuth (OIDC) is not configured");
    this.name = "MeyerAuthNotConfiguredError";
  }
}

export class MeyerAuthFailureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MeyerAuthFailureError";
  }
}

interface MeyerAuthConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface OidcConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
}

let cachedDiscovery: OidcConfiguration | null = null;
let cachedDiscoveryAt = 0;
const DISCOVERY_TTL_MS = 10 * 60 * 1000;

function getConfig(): MeyerAuthConfig {
  const issuer = process.env.MEYERAUTH_ISSUER;
  const clientId = process.env.MEYERAUTH_CLIENT_ID;
  const clientSecret = process.env.MEYERAUTH_CLIENT_SECRET;
  const redirectUri = process.env.MEYERAUTH_REDIRECT_URI;
  if (!issuer || !clientId || !clientSecret || !redirectUri) {
    throw new MeyerAuthNotConfiguredError();
  }
  return { issuer, clientId, clientSecret, redirectUri };
}

export function isMeyerAuthConfigured(): boolean {
  return Boolean(
    process.env.MEYERAUTH_ISSUER &&
      process.env.MEYERAUTH_CLIENT_ID &&
      process.env.MEYERAUTH_CLIENT_SECRET &&
      process.env.MEYERAUTH_REDIRECT_URI,
  );
}

async function discover(issuer: string): Promise<OidcConfiguration> {
  const now = Date.now();
  if (cachedDiscovery && now - cachedDiscoveryAt < DISCOVERY_TTL_MS) {
    return cachedDiscovery;
  }
  const base = issuer.replace(/\/+$/, "");
  const response = await fetch(`${base}/.well-known/openid-configuration`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new MeyerAuthFailureError("MeyerAuth OIDC discovery failed");
  }
  const data = (await response.json()) as Partial<OidcConfiguration>;
  if (
    typeof data.authorization_endpoint !== "string" ||
    typeof data.token_endpoint !== "string" ||
    typeof data.jwks_uri !== "string"
  ) {
    throw new MeyerAuthFailureError(
      "MeyerAuth OIDC discovery returned an invalid payload",
    );
  }
  cachedDiscovery = {
    issuer: typeof data.issuer === "string" ? data.issuer : issuer,
    authorization_endpoint: data.authorization_endpoint,
    token_endpoint: data.token_endpoint,
    jwks_uri: data.jwks_uri,
  };
  cachedDiscoveryAt = now;
  return cachedDiscovery;
}

export function getAuthorizeUrl(state: string, nonce: string): Promise<string> {
  const { issuer, clientId, redirectUri } = getConfig();
  return discover(issuer).then((config) => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: "openid email profile",
      state,
      nonce,
      redirect_uri: redirectUri,
    });
    return `${config.authorization_endpoint}?${params.toString()}`;
  });
}

interface MeyerAuthClaims {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  nonce?: string;
}

export async function exchangeCode(
  code: string,
  nonce: string,
): Promise<SessionUser> {
  const { issuer, clientId, clientSecret, redirectUri } = getConfig();
  const config = await discover(issuer);

  const tokenBody = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  });

  const tokenResponse = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: tokenBody,
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    throw new MeyerAuthFailureError("MeyerAuth token exchange failed");
  }

  const tokens = (await tokenResponse.json()) as { id_token?: string };
  if (!tokens.id_token) {
    throw new MeyerAuthFailureError("MeyerAuth did not return an ID token");
  }

  const jwks = createRemoteJWKSet(new URL(config.jwks_uri));
  let payload: MeyerAuthClaims;
  try {
    const { payload: verified } = await jwtVerify(tokens.id_token, jwks, {
      issuer: config.issuer,
      audience: clientId,
      algorithms: ["RS256", "ES256", "EdDSA", "PS256"],
    });
    payload = verified;
  } catch {
    throw new MeyerAuthFailureError("MeyerAuth ID token verification failed");
  }

  if (payload.nonce !== nonce) {
    throw new MeyerAuthFailureError("MeyerAuth ID token nonce mismatch");
  }
  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    throw new MeyerAuthFailureError("MeyerAuth ID token has no sub");
  }

  return toSessionUser(payload);
}

function gravatarUrl(email: string, size = 128): string {
  const hash = createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}

function toSessionUser(claims: MeyerAuthClaims): SessionUser {
  const email = claims.email?.trim().toLowerCase() ?? null;
  const name = claims.name?.trim() || null;
  const username =
    claims.preferred_username?.trim() || name || email?.split("@")[0] || "Unknown";
  return {
    id: claims.sub!,
    username,
    globalName: name,
    avatar: email ? gravatarUrl(email) : null,
    email,
    provider: "meyerauth",
  };
}