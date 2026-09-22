"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CalendarPlus,
  Check,
  Layers,
  RefreshCw,
  Users,
} from "lucide-react";
import type { Overview } from "@/lib/admin/overview";
import { adminApi } from "@/lib/admin/client";
import {
  Button,
  PageHeader,
  Pill,
  Skeleton,
  StatCard,
} from "@/components/admin/ui";

function GitHubCard({ overview }: { overview: Overview }) {
  const status = overview.github;
  return (
    <div className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-pixel text-sm uppercase tracking-[0.1em] text-grass">
          <Activity className="size-4" aria-hidden="true" />
          GitHub
        </h2>
        {status.ok ? (
          <Pill variant="published">
            <Check className="size-3" aria-hidden="true" />
            Verbunden
          </Pill>
        ) : (
          <Pill variant="danger">
            <AlertTriangle className="size-3" aria-hidden="true" />
            Fehler
          </Pill>
        )}
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Konfiguriert</dt>
          <dd className="text-foreground">
            {status.configured ? "Ja" : "Nein"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Repository</dt>
          <dd className="max-w-[60%] truncate text-foreground">
            {status.owner}/{status.repo}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Branch</dt>
          <dd className="font-mono text-foreground">{status.branch}</dd>
        </div>
      </dl>

      {status.ok && status.staging && (
        <div className="mt-5 rounded-base border border-black/40 bg-surface-2 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs uppercase tracking-[0.1em] text-muted">
              Staging
            </h3>
            {status.staging.hasChanges ? (
              <Pill variant="published">
                {status.staging.aheadBy} offene Commits
              </Pill>
            ) : (
              <Pill variant="default">Alles gepusht</Pill>
            )}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            {status.staging.stagingBranch ?? "admin-stage"} sammelt Änderungen –
            „Speichern” (oben rechts) pusht alle zusammen auf{" "}
            {status.staging.mainBranch}.
          </p>
        </div>
      )}

      {!status.ok && status.error && (
        <p className="mt-3 rounded-base border border-redstone/40 bg-redstone/10 px-3 py-2 text-xs leading-relaxed text-redstone">
          {status.error}
        </p>
      )}

      {status.ok && status.recentCommits.length > 0 && (
        <>
          <h3 className="mt-5 text-xs uppercase tracking-[0.1em] text-muted">
            Letzte Commits
          </h3>
          <ul className="mt-2 flex flex-col divide-y divide-black/40">
            {status.recentCommits.slice(0, 5).map((commit) => (
              <li key={commit.sha} className="flex items-center gap-3 py-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-grass" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    {commit.message}
                  </p>
                  <p className="text-xs text-muted">
                    {commit.authorName ?? "Bot"} ·{" "}
                    {new Date(commit.date).toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <code className="text-xs text-muted">
                  {commit.sha.slice(0, 7)}
                </code>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setOverview(await adminApi.overview());
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Fehler beim Laden.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    adminApi
      .overview()
      .then((data) => active && setOverview(data))
      .catch((cause: unknown) =>
        active &&
        setError(
          cause instanceof Error ? cause.message : "Fehler beim Laden.",
        ),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Überblick über Inhalte, Status und GitHub-Verbindung."
        actions={
          <Button variant="ghost" onClick={load} disabled={loading}>
            <RefreshCw
              className={loading ? "animate-spin" : ""}
              aria-hidden="true"
            />
            Aktualisieren
          </Button>
        }
      />

      {error && (
        <div className="rounded-block border border-redstone/40 bg-redstone/10 px-4 py-3 text-sm text-redstone">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !overview ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[86px]" />
          ))
        ) : (
          <>
            <StatCard
              label="Events gesamt"
              value={overview.stats.events.total}
              icon={<CalendarDays className="size-5" aria-hidden="true" />}
            />
            <StatCard
              label="Bevorstehend"
              value={overview.stats.events.upcoming}
              icon={<CalendarPlus className="size-5" aria-hidden="true" />}
            />
            <StatCard
              label="Crew / Inaktiv"
              value={`${overview.stats.crew.active} / ${overview.stats.crew.inactive}`}
              icon={<Users className="size-5" aria-hidden="true" />}
            />
            <StatCard
              label="Seasons"
              value={overview.stats.seasons.total}
              icon={<Layers className="size-5" aria-hidden="true" />}
            />
          </>
        )}
      </div>

      {loading || !overview ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <GitHubCard overview={overview} />

          <div className="flex flex-col gap-4">
            <div className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card">
              <h2 className="flex items-center gap-2 font-pixel text-sm uppercase tracking-[0.1em] text-grass">
                Schnellzugriff
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button href="/admin/events/new" variant="primary">
                  Neues Event
                </Button>
                <Button href="/admin/crew" variant="secondary">
                  Crew verwalten
                </Button>
                <Button href="/admin/seasons" variant="secondary">
                  Seasons verwalten
                </Button>
                <Button href="/admin/events" variant="secondary">
                  Events
                </Button>
              </div>
            </div>

            <div className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card">
              <h2 className="font-pixel text-sm uppercase tracking-[0.1em] text-grass">
                Aktuelle Season
              </h2>
              {overview.stats.seasons.active ? (
                <Link href="/admin/seasons" className="group mt-3 block">
                  <p className="text-lg font-semibold text-main-foreground transition-colors group-hover:text-grass">
                    {overview.stats.seasons.active.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {overview.stats.seasons.active.slug} ·{" "}
                    {overview.stats.seasons.active.start} bis{" "}
                    {overview.stats.seasons.active.end}
                  </p>
                </Link>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Keine Season mit aktuellem Datum gefunden.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}