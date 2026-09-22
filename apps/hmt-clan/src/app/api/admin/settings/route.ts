import { NextResponse } from "next/server";
import { guardAdminRequest, getAllowedUserIds, isOAuthConfigured } from "@/lib/auth";
import { getSessionUser } from "@/lib/auth/session";
import { discordAvatarUrl } from "@/lib/auth/discord";
import { jsonFromError } from "@/lib/admin/http";
import { getGithubStatus } from "@/lib/admin/overview";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  try {
    const [github, sessionUser] = await Promise.all([
      getGithubStatus(),
      getSessionUser(),
    ]);

    return NextResponse.json({
      auth: {
        discordConfigured: isOAuthConfigured(),
        allowedUserCount: getAllowedUserIds().length,
      },
      github,
      currentUser: sessionUser
        ? {
            id: sessionUser.id,
            username: sessionUser.username,
            globalName: sessionUser.globalName,
            avatarUrl: discordAvatarUrl(sessionUser, 96),
          }
        : null,
    });
  } catch (error) {
    return jsonFromError(error);
  }
}