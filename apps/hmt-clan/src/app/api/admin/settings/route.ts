import { NextResponse } from "next/server";
import {
  getAllowedEmails,
  getAllowedUserIds,
  guardAdminRequest,
  isMeyerAuthConfigured,
  isOAuthConfigured,
} from "@/lib/auth";
import { getSessionUser } from "@/lib/auth/session";
import { sessionAvatarUrl } from "@/lib/auth/avatar";
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
        meyerauthConfigured: isMeyerAuthConfigured(),
        meyerauthAllowedEmailCount: getAllowedEmails().length,
      },
      github,
      currentUser: sessionUser
        ? {
            id: sessionUser.id,
            username: sessionUser.username,
            globalName: sessionUser.globalName,
            email: sessionUser.email,
            provider: sessionUser.provider,
            avatarUrl: sessionAvatarUrl(sessionUser, 96),
          }
        : null,
    });
  } catch (error) {
    return jsonFromError(error);
  }
}