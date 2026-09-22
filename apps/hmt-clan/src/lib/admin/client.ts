import type { EventConfig } from "@/lib/events/types";
import type { CrewMember } from "@/lib/crew";
import type { SeasonConfig } from "@/lib/season";
import type { Overview } from "@/lib/admin/overview";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ErrorBody {
  error?: string;
}

/** Signalisiert der (Admin-)UI, dass sich der Staging-Stand geaendert hat. */
export const CHANGES_EVENT = "admin:changes";

function notifyChanges() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGES_EVENT));
  }
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as T & ErrorBody;

  if (!response.ok) {
    throw new ApiError(
      data?.error ?? "Die Anfrage ist fehlgeschlagen.",
      response.status,
    );
  }

  if (init?.method && init.method !== "GET") {
    notifyChanges();
  }

  return data as T;
}

export function adminGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

export function adminMutation<T>(path: string, method: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/* ------------------------------------------------------------------ */
/* Typisierte Admin-API-Wrapper                                        */
/* ------------------------------------------------------------------ */

export type EventListItem = EventConfig & { hasMarkdown: boolean };

export const adminApi = {
  // Events
  listEvents: () => adminGet<EventListItem[]>("/api/admin/events"),
  getEvent: (slug: string) =>
    adminGet<{ event: EventConfig; markdown: string | null; hasMarkdown: boolean }>(
      `/api/admin/events/${encodeURIComponent(slug)}`,
    ),
  createEvent: (input: Record<string, unknown>) =>
    adminMutation<{ ok: true; event: EventConfig }>("/api/admin/events", "POST", input),
  updateEvent: (slug: string, input: Record<string, unknown>) =>
    adminMutation<{ ok: true; event: EventConfig }>(
      `/api/admin/events/${encodeURIComponent(slug)}`,
      "PATCH",
      input,
    ),
  deleteEvent: (slug: string) =>
    adminMutation<{ ok: true }>(
      `/api/admin/events/${encodeURIComponent(slug)}`,
      "DELETE",
    ),
  getMarkdown: (slug: string) =>
    adminGet<{ markdown: string | null }>(
      `/api/admin/events/${encodeURIComponent(slug)}/markdown`,
    ),
  putMarkdown: (slug: string, markdown: string) =>
    adminMutation<{ ok: true; markdown: string }>(
      `/api/admin/events/${encodeURIComponent(slug)}/markdown`,
      "PUT",
      { markdown },
    ),

  // Crew
  listCrew: () => adminGet<CrewMember[]>("/api/admin/crew"),
  createMember: (input: Record<string, unknown>) =>
    adminMutation<{ ok: true; member: CrewMember }>("/api/admin/crew", "POST", input),
  updateMember: (slug: string, input: Record<string, unknown>) =>
    adminMutation<{ ok: true; member: CrewMember }>(
      `/api/admin/crew/${encodeURIComponent(slug)}`,
      "PATCH",
      input,
    ),
  deleteMember: (slug: string) =>
    adminMutation<{ ok: true }>(
      `/api/admin/crew/${encodeURIComponent(slug)}`,
      "DELETE",
    ),
  reorderCrew: (order: string[]) =>
    adminMutation<{ ok: true; members: CrewMember[] }>("/api/admin/crew", "PUT", {
      order,
    }),

  // Seasons
  listSeasons: () => adminGet<SeasonConfig[]>("/api/admin/seasons"),
  createSeason: (input: Record<string, unknown>) =>
    adminMutation<{ ok: true; season: SeasonConfig }>("/api/admin/seasons", "POST", input),
  updateSeason: (slug: string, input: Record<string, unknown>) =>
    adminMutation<{ ok: true; season: SeasonConfig }>(
      `/api/admin/seasons/${encodeURIComponent(slug)}`,
      "PATCH",
      input,
    ),
  deleteSeason: (slug: string) =>
    adminMutation<{ ok: true }>(
      `/api/admin/seasons/${encodeURIComponent(slug)}`,
      "DELETE",
    ),

  // Overview & settings
  overview: () => adminGet<Overview>("/api/admin/overview"),
  settings: () => adminGet<SettingsResponse>("/api/admin/settings"),

  // Staging
  stagingStatus: () => adminGet<StagingStatus>("/api/admin/staging"),
  flushStaging: () =>
    adminMutation<FlushResult>("/api/admin/commit", "POST"),
  discardStaging: () =>
    adminMutation<DiscardResult>("/api/admin/discard", "POST"),
};

export interface StagingStatus {
  configured: boolean;
  mainBranch: string;
  stagingBranch: string | null;
  aheadBy: number;
  behindBy: number;
  hasChanges: boolean;
  status: string;
}

export interface FlushResult {
  mode: "none" | "fast-forward" | "merge";
  commitsPushed: number;
  sha: string | null;
  merged: boolean;
}

export interface DiscardResult {
  discards: number;
}

export type SettingsResponse = {
  auth: {
    discordConfigured: boolean;
    allowedUserCount: number;
  };
  github: Overview["github"];
  currentUser: {
    id: string;
    username: string;
    globalName: string | null;
    avatarUrl: string;
  } | null;
};