const DISCORD_API = "https://discord.com/api/v10";
const DISCORD_AUTHORIZE_URL = "https://discord.com/oauth2/authorize";

export class OAuthNotConfiguredError extends Error {
  constructor() {
    super("Discord OAuth is not configured");
    this.name = "OAuthNotConfiguredError";
  }
}

export class OAuthFailureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OAuthFailureError";
  }
}

export interface DiscordUser {
  /** Discord User ID (Snowflake, als String behandeln). */
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
}

interface DiscordConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

function getDiscordConfig(): DiscordConfig {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new OAuthNotConfiguredError();
  }
  return { clientId, clientSecret, redirectUri };
}

export function isDiscordConfigured(): boolean {
  return Boolean(
    process.env.DISCORD_CLIENT_ID &&
      process.env.DISCORD_CLIENT_SECRET &&
      process.env.DISCORD_REDIRECT_URI,
  );
}

export function getAuthorizeUrl(state: string): string {
  const { clientId, redirectUri } = getDiscordConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "identify",
    state,
    redirect_uri: redirectUri,
  });
  return `${DISCORD_AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCode(code: string): Promise<DiscordUser> {
  const { clientId, clientSecret, redirectUri } = getDiscordConfig();

  const tokenBody = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const tokenResponse = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: tokenBody,
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    throw new OAuthFailureError("Discord token exchange failed");
  }

  const tokens = (await tokenResponse.json()) as { access_token?: string };
  if (!tokens.access_token) {
    throw new OAuthFailureError("Discord did not return an access token");
  }

  const meResponse = await fetch(`${DISCORD_API}/users/@me`, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
    cache: "no-store",
  });

  if (!meResponse.ok) {
    throw new OAuthFailureError("Failed to fetch Discord user");
  }

  const user = (await meResponse.json()) as DiscordUser;
  if (!user?.id) {
    throw new OAuthFailureError("Discord returned an invalid user payload");
  }
  return user;
}

/** Discord-Avatar-URL oder ein Default-Avatar, falls keiner vorhanden ist. */
export function discordAvatarUrl(
  user: Pick<DiscordUser, "id" | "avatar">,
  size = 64,
): string {
  if (!user.avatar) {
    const index = Number((BigInt(user.id) >> BigInt(22)) % BigInt(6));
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
  const animated = user.avatar.startsWith("a_");
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
    animated ? "gif" : "png"
  }?size=${size}`;
}

export function toSessionUser(user: DiscordUser): {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
} {
  return {
    id: user.id,
    username: user.username,
    globalName: user.global_name ?? null,
    avatar: user.avatar ?? null,
  };
}