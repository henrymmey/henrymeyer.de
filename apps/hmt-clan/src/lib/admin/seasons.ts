import type { SeasonConfig } from "@/lib/season";
import { CONTENT_FILES } from "./paths";
import { ContentError, readJsonList, writeJsonList } from "./content";
import type { SeasonCreateInput, SeasonPatchInput } from "./schemas";

type JsonRecord = Record<string, unknown>;

function seasonNotFound(): ContentError {
  return new ContentError("Season not found.", 404, "season_not_found");
}

function seasonExists(slug: string): ContentError {
  return new ContentError(
    `A season with the slug "${slug}" already exists.`,
    409,
    "season_exists",
  );
}

/** Kanonische Feld-Reihenfolge der season.json. */
function toCanonicalSeason(season: SeasonConfig): JsonRecord {
  const result: JsonRecord = {
    slug: season.slug,
    name: season.name,
    start: season.start,
    end: season.end,
    priority: season.priority,
  };
  if (season.showEvents !== undefined) {
    result.showEvents = season.showEvents;
  }
  return result;
}

export async function readAllSeasons(): Promise<{
  seasons: SeasonConfig[];
  sha: string | null;
}> {
  const { data, sha } = await readJsonList(CONTENT_FILES.seasons);
  return { seasons: data as SeasonConfig[], sha };
}

function ensureSeason(seasons: SeasonConfig[], slug: string): SeasonConfig {
  const season = seasons.find((candidate) => candidate.slug === slug);
  if (!season) {
    throw seasonNotFound();
  }
  return season;
}

function assertUniqueSlug(slug: string, seasons: SeasonConfig[]): void {
  if (seasons.some((season) => season.slug === slug)) {
    throw seasonExists(slug);
  }
}

export async function createSeason(
  input: SeasonCreateInput,
): Promise<{ season: SeasonConfig }> {
  const { seasons, sha } = await readAllSeasons();
  assertUniqueSlug(input.slug, seasons);

  const season: SeasonConfig = {
    slug: input.slug,
    name: input.name,
    start: input.start,
    end: input.end,
    priority: input.priority,
    showEvents: input.showEvents,
  };

  const next = [...seasons, season];
  await writeJsonList(
    CONTENT_FILES.seasons,
    next,
    `admin: create season "${input.name}"`,
    sha,
  );

  return { season };
}

export async function updateSeason(
  slug: string,
  input: SeasonPatchInput,
): Promise<{ season: SeasonConfig }> {
  const { seasons, sha } = await readAllSeasons();
  const index = seasons.findIndex((season) => season.slug === slug);
  if (index === -1) {
    throw seasonNotFound();
  }

  const current = seasons[index];
  const merged: SeasonConfig = { ...current };

  if (input.name !== undefined) merged.name = input.name;
  if (input.slug !== undefined) merged.slug = input.slug;
  if (input.start !== undefined) merged.start = input.start;
  if (input.end !== undefined) merged.end = input.end;
  if (input.priority !== undefined) merged.priority = input.priority;
  if (input.showEvents !== undefined) {
    merged.showEvents = input.showEvents ?? undefined;
  }

  const slugChanged = merged.slug !== slug;
  if (slugChanged) {
    assertUniqueSlug(merged.slug, seasons.filter((_, i) => i !== index));
  }

  const next = [...seasons];
  next.splice(index, 1, toCanonicalSeason(merged) as unknown as SeasonConfig);

  await writeJsonList(
    CONTENT_FILES.seasons,
    next,
    `admin: update season "${merged.name}"`,
    sha,
  );

  return { season: merged };
}

export async function deleteSeason(slug: string): Promise<void> {
  const { seasons, sha } = await readAllSeasons();
  const index = seasons.findIndex((season) => season.slug === slug);
  if (index === -1) {
    throw seasonNotFound();
  }

  const next = [...seasons];
  next.splice(index, 1);

  await writeJsonList(
    CONTENT_FILES.seasons,
    next,
    `admin: delete season "${seasons[index].name}"`,
    sha,
  );
}

export { ensureSeason };
export type { SeasonConfig };