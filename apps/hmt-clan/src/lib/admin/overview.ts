import type { SeasonConfig } from "@/lib/season";
import { isGithubConfigured } from "@/lib/auth";
import {
  GitHubError,
  getGithubConfig,
  listCommits,
  type SimpleCommit,
} from "@/lib/github/github-service";
import { CONTENT_DIRS, CONTENT_FILES } from "./paths";
import { readAllEvents } from "./events";
import { readAllMembers } from "./crew";
import { readAllSeasons } from "./seasons";

export interface GithubStatus {
  configured: boolean;
  ok: boolean;
  owner: string;
  repo: string;
  branch: string;
  error: string | null;
  recentCommits: SimpleCommit[];
}

export interface Overview {
  stats: {
    events: {
      total: number;
      visible: number;
      upcoming: number;
      past: number;
      drafts: number;
    };
    crew: { total: number; active: number; inactive: number };
    seasons: { total: number; active: SeasonConfig | null };
  };
  github: GithubStatus;
}

function computeActiveSeason(seasons: SeasonConfig[]): SeasonConfig | null {
  if (seasons.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);

  const running = seasons.find(
    (season) => season.start <= today && season.end >= today,
  );
  if (running) return running;

  const upcoming = seasons
    .filter((season) => season.start > today)
    .sort((a, b) => a.start.localeCompare(b.start));
  if (upcoming.length > 0) return upcoming[0];

  return [...seasons].sort((a, b) => b.end.localeCompare(a.end))[0];
}

const RECENT_PATHS = [
  CONTENT_FILES.events,
  CONTENT_FILES.crew,
  CONTENT_FILES.seasons,
  CONTENT_DIRS.eventMarkdown,
];

export async function getRecentCommits(limit = 10): Promise<SimpleCommit[]> {
  const groups = await Promise.all(
    RECENT_PATHS.map((path) =>
      listCommits({ path, perPage: 4 }).catch(() => [] as SimpleCommit[]),
    ),
  );

  const seen = new Set<string>();
  const merged: SimpleCommit[] = [];
  for (const group of groups) {
    for (const commit of group) {
      if (seen.has(commit.sha)) continue;
      seen.add(commit.sha);
      merged.push(commit);
    }
  }

  return merged
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export async function getGithubStatus(): Promise<GithubStatus> {
  const config = getGithubConfig();
  const base = {
    configured: isGithubConfigured(),
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
  };

  if (!base.configured) {
    return {
      ...base,
      ok: false,
      error: "GitHub API is not configured (HMT_GITHUB_TOKEN fehlt).",
      recentCommits: [],
    };
  }

  try {
    const recentCommits = await getRecentCommits(10);
    return { ...base, ok: true, error: null, recentCommits };
  } catch (error) {
    const message =
      error instanceof GitHubError
        ? error.message
        : "GitHub API is currently unavailable.";
    console.error("[admin] github status check failed:", error instanceof Error ? error.message : error);
    return { ...base, ok: false, error: message, recentCommits: [] };
  }
}

export async function getOverview(): Promise<Overview> {
  const [events, crew, seasons, github] = await Promise.all([
    readAllEvents(),
    readAllMembers(),
    readAllSeasons(),
    getGithubStatus(),
  ]);

  const visible = events.events.filter((event) => event.show);

  return {
    stats: {
      events: {
        total: events.events.length,
        visible: visible.length,
        upcoming: visible.filter((event) => !event.done).length,
        past: visible.filter((event) => event.done).length,
        drafts: events.events.length - visible.length,
      },
      crew: {
        total: crew.members.length,
        active: crew.members.filter((member) => !member.inactive).length,
        inactive: crew.members.filter((member) => member.inactive).length,
      },
      seasons: {
        total: seasons.seasons.length,
        active: computeActiveSeason(seasons.seasons),
      },
    },
    github,
  };
}

export type { SeasonConfig };