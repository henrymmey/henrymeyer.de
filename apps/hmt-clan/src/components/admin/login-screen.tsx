"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, ShieldX, TerminalSquare } from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";
import { Button } from "@/components/admin/ui";

export function LoginScreen({ configured }: { configured: boolean }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="texture texture-obsidian tex-24 absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-grass/10 blur-[120px]"
      />

      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-lift">
          <div className="flex items-center justify-center gap-3 border-b border-black/40 bg-black/20 px-6 py-6">
            <Image
              src="/logo.png"
              alt="HMT Clan Logo"
              width={48}
              height={48}
              className="size-12 rounded-block border border-black/50 bg-surface-3 p-1 shadow-card"
            />
            <div>
              <p className="font-pixel text-lg uppercase leading-tight tracking-[0.1em] text-foreground">
                HMT Clan
              </p>
              <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-grass">
                Admin Dashboard
              </p>
            </div>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-sm leading-relaxed text-muted">
              Manage the HMT Clan website. Changes are committed directly to
              GitHub via{" "}
              <span className="text-foreground">the HMT Clan bot</span>.
            </p>

            <div className="mt-8">
              {configured ? (
                <Button
                  href="/api/admin/auth/login"
                  size="lg"
                  className="w-full bg-[#5865F2] text-white shadow-[0_3px_0_0_rgb(0_0_0/0.5)] hover:brightness-110"
                >
                  <Image
                    src="/badges/discord.png"
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    className="size-5 object-contain"
                  />
                  Continue with Discord
                </Button>
              ) : (
                <div className="rounded-base border border-redstone/40 bg-redstone/10 px-4 py-3 text-sm text-redstone">
                  Discord OAuth is not configured. Set{" "}
                  <code className="font-mono">DISCORD_*</code> environment
                  variables first.
                </div>
              )}
            </div>

            <p className="mt-6 text-xs text-muted">
              Zugriff nur für autorisierte HMT-Clan-Mitglieder.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export function AccessDeniedScreen({ user }: { user: SessionUser }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="texture texture-obsidian tex-24 absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-redstone/10 blur-[120px]"
      />

      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-block border border-redstone/40 bg-redstone/15 text-redstone">
          <ShieldX className="size-8" aria-hidden="true" />
        </div>

        <h1 className="font-pixel text-3xl uppercase leading-tight text-foreground md:text-4xl">
          Access <span className="text-redstone">denied</span>
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Your Discord account{" "}
          <span className="text-foreground">
            {user.globalName ?? user.username}
          </span>{" "}
          is not authorized to access the HMT Clan Admin Dashboard.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </Button>
          <Button variant="ghost" href="/">
            <TerminalSquare className="size-4" aria-hidden="true" />
            Website
          </Button>
        </div>
      </div>
    </main>
  );
}