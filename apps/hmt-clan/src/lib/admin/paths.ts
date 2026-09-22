/** Feste Repository-Pfade des HMT-Clan-Contents. */
export const CONTENT_FILES = {
  events: "apps/hmt-clan/src/lib/events.json",
  crew: "apps/hmt-clan/src/lib/crew.json",
  seasons: "apps/hmt-clan/src/lib/season.json",
} as const;

export const CONTENT_DIRS = {
  eventMarkdown: "apps/hmt-clan/src/content/events",
} as const;

export function eventMarkdownPath(slug: string): string {
  return `${CONTENT_DIRS.eventMarkdown}/${slug}.md`;
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;