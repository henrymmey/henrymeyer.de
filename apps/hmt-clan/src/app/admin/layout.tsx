import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  AccessDeniedScreen,
  LoginScreen,
} from "@/components/admin/login-screen";
import { getSessionUser } from "@/lib/auth/session";
import {
  isAllowedUser,
  isMeyerAuthConfigured,
  isOAuthConfigured,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | HMT Clan",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    return (
      <LoginScreen
        discordConfigured={isOAuthConfigured()}
        meyerauthConfigured={isMeyerAuthConfigured()}
      />
    );
  }

  if (!isAllowedUser(user)) {
    return <AccessDeniedScreen user={user} />;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}