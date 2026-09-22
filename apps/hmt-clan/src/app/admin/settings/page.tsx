"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, LogOut, Settings as SettingsIcon, X } from "lucide-react";
import { adminApi, type SettingsResponse } from "@/lib/admin/client";
import { Button, PageHeader, Skeleton } from "@/components/admin/ui";

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-grass">
      <Check className="size-4" aria-hidden="true" />
      Konfiguriert
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-redstone">
      <X className="size-4" aria-hidden="true" />
      Nicht konfiguriert
    </span>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .settings()
      .then((response) => active && setData(response))
      .catch((cause: unknown) =>
        active &&
        setError(
          cause instanceof Error ? cause.message : "Fehler beim Laden.",
        ),
      );
    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.refresh();
  }

  if (!data && !error) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-56 md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Konfiguration, Status und Verbindungen des Admin-Dashboards."
      />

      {error && (
        <div className="rounded-block border border-redstone/40 bg-redstone/10 px-4 py-3 text-sm text-redstone">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.currentUser && (
              <div className="flex items-center gap-4 rounded-block border border-black/60 bg-surface-3 p-5 shadow-card">
                {data.currentUser.avatarUrl ? (
                  <Image
                    src={data.currentUser.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-full border border-black/60"
                    unoptimized
                  />
                ) : (
                  <span className="flex size-12 items-center justify-center rounded-full border border-black/60 bg-surface-2 text-muted">
                    <SettingsIcon className="size-5" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-main-foreground">
                    {data.currentUser.username}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {data.currentUser.globalName ?? "Kein Global-Name"} · ID{" "}
                    {data.currentUser.id}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="size-3.5" aria-hidden="true" />
                    Logout
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card">
              <h2 className="text-sm font-medium text-foreground">Discord OAuth</h2>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge ok={data.auth.discordConfigured} />
              </div>
              <p className="mt-2 text-sm text-muted">
                {data.auth.discordConfigured
                  ? "Login per Discord aktiv. Sessions werden per JWT signiert."
                  : "Setze DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET und DISCORD_REDIRECT_URI."}
              </p>
              <p className="mt-2 text-sm text-muted">
                {data.auth.allowedUserCount} erlaubte{" "}
                {data.auth.allowedUserCount === 1
                  ? "Benutzer-ID"
                  : "Benutzer-IDs"}{" "}
                in DISCORD_ALLOWED_USER_IDS.
              </p>
            </div>
          </div>

          <div className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card">
            <h2 className="text-sm font-medium text-foreground">
              GitHub Verbindung
            </h2>
            <div className="mt-2">
              <StatusBadge ok={data.github.configured} />
            </div>

            {data.github.configured ? (
              <>
                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-muted">
                      Repository
                    </dt>
                    <dd className="mt-0.5 truncate text-foreground">
                      {data.github.owner}/{data.github.repo}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-muted">
                      Branch
                    </dt>
                    <dd className="mt-0.5 font-mono text-foreground">
                      {data.github.branch}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-muted">
                      Status
                    </dt>
                    <dd className="mt-0.5 font-medium text-grass">Verbunden</dd>
                  </div>
                </dl>
                <p className="mt-4 rounded-base border border-black/40 bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-muted">
                  Alle Änderungen im Admin-Bereich werden über die GitHub-API als
                  Commits auf dem Branch{" "}
                  <code className="text-foreground">{data.github.branch}</code>{" "}
                  geschrieben. Ein Push auf das Repository deployed die Website
                  automatisch.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">
                GitHub ist nicht konfiguriert – setze{" "}
                <code className="text-foreground">HMT_GITHUB_TOKEN</code>.
                Inhalte könnten dann nicht gespeichert werden.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}