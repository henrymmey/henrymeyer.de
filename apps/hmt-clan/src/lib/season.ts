import seasonsData from "./season.json";
import { crew } from "./crew";
import { getEventsBySeason } from "./events";

export interface SeasonConfig {
  slug: string;
  name: string;
  start: string;
  end: string;
  priority: number;
  /** Zeigt die "Events dieser Season"-Section an. Standard: true. */
  showEvents?: boolean;
}

export const seasons = seasonsData as SeasonConfig[];

function byPriorityAsc(a: SeasonConfig, b: SeasonConfig): number {
  return a.priority - b.priority;
}

export function getSeasons(): SeasonConfig[] {
  return [...seasons].sort(byPriorityAsc);
}

export function getSeasonBySlug(slug: string): SeasonConfig | null {
  return seasons.find((season) => season.slug === slug) ?? null;
}

export function getAllSeasonSlugs(): string[] {
  return seasons.map((season) => season.slug);
}

export function getSeasonMembers(slug: string) {
  return crew.filter(
    (member) => Array.isArray(member.seasons) && member.seasons.includes(slug),
  );
}

export function getSeasonEvents(slug: string) {
  return getEventsBySeason(slug);
}

export function seasonShowsEvents(season: SeasonConfig): boolean {
  return season.showEvents !== false;
}

export function formatSeasonSpan(season: SeasonConfig): string {
  const formatter = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const start = formatter.format(new Date(season.start + "T00:00:00"));
  const end = formatter.format(new Date(season.end + "T00:00:00"));
  return `${start} – ${end}`;
}