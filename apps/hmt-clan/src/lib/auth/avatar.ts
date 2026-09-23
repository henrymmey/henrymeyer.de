import { discordAvatarUrl } from "./discord";
import type { SessionUser } from "./session";

export function sessionAvatarUrl(user: SessionUser, size = 64): string {
  if (user.provider === "meyerauth") {
    return (
      user.avatar ?? `https://www.gravatar.com/avatar/?d=identicon&s=${size}`
    );
  }
  return discordAvatarUrl(user, size);
}