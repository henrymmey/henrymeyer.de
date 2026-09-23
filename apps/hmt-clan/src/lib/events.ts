import { readFile } from "fs/promises";
import { join } from "path";
import eventsData from "./events.json";
import type { EventConfig } from "./events/types";

const EVENTS = eventsData as unknown as EventConfig[];

function byDateAsc(a: EventConfig, b: EventConfig): number {
  return a.date.localeCompare(b.date);
}

export function getVisibleEvents(): EventConfig[] {
  return EVENTS.filter((e) => e.show).sort(byDateAsc);
}

export function getNextEvent(): EventConfig | null {
  const upcoming = EVENTS.filter((e) => e.show && !e.done && e.countdown).sort(
    byDateAsc,
  );
  return upcoming[0] ?? null;
}

export function getEventStartTimestamp(event: EventConfig): number {
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour = 0, minute = 0] = (event.time ?? "").split(":").map(Number);

  // Interpret date and time as wall-clock time in Europe/Berlin.
  const guessUtc = Date.UTC(year, month - 1, day, hour, minute);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(new Date(guessUtc))) {
    parts[part.type] = part.value;
  }

  const wallClockUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return guessUtc - (wallClockUtc - guessUtc);
}

export function getEventTargetLabel(event: EventConfig): string {
  const date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(event.date + "T00:00:00"));
  return event.showTime && event.time ? `${date} · ${event.time} Uhr` : date;
}

export function getHomepageEvents(): EventConfig[] {
  const visible = EVENTS.filter((e) => e.show);

  const upcoming = visible
    .filter((e) => !e.done)
    .sort(byDateAsc);

  const past = visible
    .filter((e) => e.done)
    .sort(byDateAsc)
    .pop();

  const result: EventConfig[] = [];

  if (past) {
    result.push(past);
  }

  for (const event of upcoming) {
    if (result.length === 3) break;
    result.push(event);
  }

  return result;
}

export function getEventsBySeason(seasonSlug: string): EventConfig[] {
  return EVENTS.filter(
    (event) => event.season === seasonSlug && event.show,
  ).sort(byDateAsc);
}

export function getAllEventSlugs(): string[] {
  return EVENTS.filter((e) => e.show).map((e) => e.slug);
}

export function getEventBySlug(slug: string): EventConfig | null {
  return EVENTS.find((e) => e.slug === slug) ?? null;
}

export async function getEventDescription(slug: string): Promise<string | null> {
  try {
    const filePath = join(
      process.cwd(),
      "src/content/events",
      `${slug}.md`
    );
    return await readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}
