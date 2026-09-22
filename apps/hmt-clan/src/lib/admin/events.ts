import {
  deleteRepositoryFile,
  getRepositoryFile,
  putRepositoryFile,
} from "@/lib/github/github-service";
import type { EventConfig, EventIcon, EventLink } from "@/lib/events/types";
import { CONTENT_FILES, eventMarkdownPath } from "./paths";
import { ContentError, readJsonList, writeJsonList } from "./content";
import type { EventCreateInput, EventPatchInput } from "./schemas";

type JsonRecord = Record<string, unknown>;

function eventNotFound(): ContentError {
  return new ContentError("Event not found.", 404, "event_not_found");
}

function eventExists(slug: string): ContentError {
  return new ContentError(
    `An event with the slug "${slug}" already exists.`,
    409,
    "event_exists",
  );
}

/** Baut ein Event-Objekt in der kanonischen Feld-Reihenfolge der events.json. */
function toCanonicalEvent(event: EventConfig): JsonRecord {
  const result: JsonRecord = {
    name: event.name,
    slug: event.slug,
    description: event.description,
    priority: event.priority,
    date: event.date,
  };
  if (event.time) {
    result.time = event.time;
  }
  result.showTime = event.showTime;
  result.show = event.show;
  result.showDetailsButton = event.showDetailsButton;
  result.done = event.done;
  if (event.season) {
    result.season = event.season;
  }
  if (event.icon) {
    result.icon = event.icon;
  }
  if (event.links && event.links.length > 0) {
    result.links = event.links.map((link) => ({
      displayName: link.displayName,
      url: link.url,
    }));
  }
  return result;
}

function normLinks(links: EventLink[] | null | undefined): EventLink[] | null {
  if (!links || links.length === 0) return null;
  return links;
}

function applyPatch(event: EventConfig, patch: EventPatchInput): EventConfig {
  const merged = { ...event };

  const scalar: Record<string, keyof EventPatchInput> = {
    name: "name",
    description: "description",
    priority: "priority",
    date: "date",
    showTime: "showTime",
    show: "show",
    showDetailsButton: "showDetailsButton",
    done: "done",
  };
  for (const [field, key] of Object.entries(scalar) as [
    string,
    keyof EventPatchInput,
  ][]) {
    if (patch[key] !== undefined) {
      (merged as unknown as Record<string, unknown>)[field] = patch[key];
    }
  }

  if (patch.time !== undefined) {
    merged.time = patch.time ?? undefined;
  }
  if (patch.icon !== undefined) {
    merged.icon = (patch.icon ?? undefined) as EventIcon | undefined;
  }
  if (patch.season !== undefined) {
    merged.season = patch.season ?? undefined;
  }
  if (patch.links !== undefined) {
    merged.links = normLinks(patch.links) ?? undefined;
  }
  if (patch.slug !== undefined) {
    merged.slug = patch.slug;
  }

  return merged;
}

export async function readAllEvents(): Promise<{
  events: EventConfig[];
  sha: string | null;
}> {
  const { data, sha } = await readJsonList(CONTENT_FILES.events);
  return { events: data as EventConfig[], sha };
}

function assertUniqueSlug(slug: string, events: EventConfig[]): void {
  if (events.some((event) => event.slug === slug)) {
    throw eventExists(slug);
  }
}

function ensureEvent(events: EventConfig[], slug: string): EventConfig {
  const event = events.find((candidate) => candidate.slug === slug);
  if (!event) {
    throw eventNotFound();
  }
  return event;
}

export async function createEvent(
  input: EventCreateInput,
): Promise<{ event: EventConfig }> {
  const { events, sha } = await readAllEvents();
  assertUniqueSlug(input.slug, events);

  const priority =
    input.priority ??
    (events.length > 0
      ? Math.max(...events.map((event) => event.priority ?? 0)) + 1
      : 1);

  const event: EventConfig = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? "",
    priority,
    date: input.date,
    time: input.time ?? undefined,
    showTime: input.showTime,
    show: input.show,
    showDetailsButton: input.showDetailsButton,
    done: input.done,
    icon: (input.icon ?? undefined) as EventIcon | undefined,
    season: input.season ?? undefined,
    links: normLinks(input.links) ?? undefined,
  };

  const next = [...events, event];
  await writeJsonList(
    CONTENT_FILES.events,
    next,
    `admin: create event "${input.name}"`,
    sha,
  );

  return { event };
}

export async function updateEvent(
  slug: string,
  input: EventPatchInput,
): Promise<{ event: EventConfig }> {
  const { events, sha } = await readAllEvents();
  const index = events.findIndex((event) => event.slug === slug);
  if (index === -1) {
    throw eventNotFound();
  }

  const merged = applyPatch(events[index], input);
  const nextSlug = merged.slug;

  const slugChanged = nextSlug !== slug;
  if (slugChanged) {
    assertUniqueSlug(nextSlug, events.filter((_, i) => i !== index));
  }

  const next = [...events];
  next.splice(index, 1, toCanonicalEvent(merged) as unknown as EventConfig);

  await writeJsonList(
    CONTENT_FILES.events,
    next,
    `admin: update event "${merged.name}"`,
    sha,
  );

  if (slugChanged) {
    await moveEventMarkdown(slug, nextSlug);
  }

  return { event: merged };
}

async function moveEventMarkdown(oldSlug: string, newSlug: string): Promise<void> {
  try {
    const old = await getRepositoryFile(eventMarkdownPath(oldSlug));
    if (!old) return;

    const existing = await getRepositoryFile(eventMarkdownPath(newSlug));
    if (existing) {
      if (existing.content !== old.content) {
        await putRepositoryFile({
          path: eventMarkdownPath(newSlug),
          content: old.content,
          message: `admin: move event markdown "${oldSlug}" -> "${newSlug}"`,
          sha: existing.sha,
        });
      }
    } else {
      await putRepositoryFile({
        path: eventMarkdownPath(newSlug),
        content: old.content,
        message: `admin: move event markdown "${oldSlug}" -> "${newSlug}"`,
      });
    }

    await deleteRepositoryFile({
      path: eventMarkdownPath(oldSlug),
      message: `admin: remove old event markdown "${oldSlug}"`,
      sha: old.sha,
    }).catch(() => {
      /* Alte Datei fehlt bereits – das ist ok. */
    });
  } catch (error) {
    console.error("[admin] markdown move for event failed:", error);
  }
}

export async function deleteEvent(slug: string): Promise<void> {
  const { events, sha } = await readAllEvents();
  const index = events.findIndex((event) => event.slug === slug);
  if (index === -1) {
    throw eventNotFound();
  }

  const name = events[index].name;
  const next = [...events];
  next.splice(index, 1);

  await writeJsonList(
    CONTENT_FILES.events,
    next,
    `admin: delete event "${name}"`,
    sha,
  );

  const markdown = await getRepositoryFile(eventMarkdownPath(slug));
  if (markdown) {
    await deleteRepositoryFile({
      path: eventMarkdownPath(slug),
      message: `admin: delete event markdown "${name}"`,
      sha: markdown.sha,
    }).catch(() => {
      /* bereits weg – ok */
    });
  }
}

export async function getEvent(slug: string): Promise<EventConfig | null> {
  const { events } = await readAllEvents();
  return events.find((event) => event.slug === slug) ?? null;
}

export async function getEventWithMarkdown(slug: string): Promise<{
  event: EventConfig;
  markdown: string | null;
  hasMarkdown: boolean;
} | null> {
  const event = await getEvent(slug);
  if (!event) return null;

  const file = await getRepositoryFile(eventMarkdownPath(slug));
  const markdown = file?.content ?? null;
  return { event, markdown, hasMarkdown: Boolean(file) };
}

export async function listEventsWithMarkdown(): Promise<
  (EventConfig & { hasMarkdown: boolean })[]
> {
  const { events } = await readAllEvents();
  const marks = await Promise.all(
    events.map(async (event) => {
      const exists = await getRepositoryFile(eventMarkdownPath(event.slug));
      return Boolean(exists);
    }),
  );
  return events.map((event, index) => ({
    ...event,
    hasMarkdown: marks[index],
  }));
}

export async function getEventMarkdown(slug: string): Promise<string | null> {
  ensureEvent((await readAllEvents()).events, slug);
  const file = await getRepositoryFile(eventMarkdownPath(slug));
  return file?.content ?? null;
}

export async function putEventMarkdown(
  slug: string,
  markdown: string,
): Promise<string> {
  const event = ensureEvent((await readAllEvents()).events, slug);

  const file = await getRepositoryFile(eventMarkdownPath(slug));
  await putRepositoryFile({
    path: eventMarkdownPath(slug),
    content: markdown,
    message: `admin: update event "${event.name}" markdown`,
    sha: file?.sha,
  });

  return markdown;
}