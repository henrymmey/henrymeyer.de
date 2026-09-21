export interface ThescapeStats {
  level: string | null;
  playTime: string | null;
  coins: string | null;
}

export interface StatCard {
  value: string;
  label: string;
}

export interface StatCategory {
  title: string;
  stats: StatCard[];
}

export interface FullPlayerProfile {
  name: string;
  level?: string;
  playTime?: string;
  lastSeen?: string;
  coins?: string;
  categories: StatCategory[];
}

const BASE_URL = "https://thescape.de/spielersuche";
const TTL_MS = 3600 * 1000;

type HtmlCacheEntry = {
  html: string;
  expiresAt: number;
};

const htmlCache = new Map<string, HtmlCacheEntry>();

const EMPTY_STATS: ThescapeStats = {
  level: null,
  playTime: null,
  coins: null,
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

async function fetchProfileHtml(
  slug: string,
): Promise<string | null> {
  const now = Date.now();
  const cached = htmlCache.get(slug);
  if (cached && cached.expiresAt > now) {
    return cached.html;
  }

  try {
    const url = `${BASE_URL}/${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HMT-Clan-Bot/1.0)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    htmlCache.set(slug, { html, expiresAt: now + TTL_MS });
    return html;
  } catch {
    return null;
  }
}

function extractValue(html: string, label: string): string | null {
  const labelRe = new RegExp(`class="([^"]*)"[^>]*>${label}<\\/span>`);
  const match = labelRe.exec(html);
  if (!match) {
    return null;
  }

  const spanRe = /<span([^>]*)>([^<]*)<\/span>/g;
  spanRe.lastIndex = match.index + match[0].length;

  let item: RegExpExecArray | null;
  let attempts = 0;
  while ((item = spanRe.exec(html)) && attempts < 30) {
    attempts += 1;
    if (/hidden/.test(item[1])) {
      continue;
    }
    const text = item[2].trim();
    if (text) {
      return text;
    }
  }

  return null;
}

function extractLastSeen(html: string): string | null {
  return extractValue(html, "Zuletzt gesehen");
}

function extractLevel(html: string): string | null {
  const match = html.match(
    /InGame-Level:\s*<span[^>]*>([^<]+)<\/span>/,
  );
  return match ? decodeEntities(match[1]) : null;
}

function extractName(html: string): string {
  const match = html.match(/<title>([^<»]+?)\s*»\s*Spielerprofil/);
  return match ? decodeEntities(match[1]) : "";
}

function extractCategories(html: string): StatCategory[] {
  const boxRe = /class="p-6 relative mb-6"/g;
  const categories: StatCategory[] = [];
  const seen = new Set<string>();

  let box: RegExpExecArray | null;
  const boxes: { start: number; end: number }[] = [];
  while ((box = boxRe.exec(html)) !== null) {
    boxes.push({ start: box.index, end: 0 });
  }

  for (let i = 0; i < boxes.length; i += 1) {
    boxes[i].end = i + 1 < boxes.length ? boxes[i + 1].start : html.length;
  }

  for (const { start, end } of boxes) {
    const segment = html.slice(start, end);

    const svgClose = segment.lastIndexOf("</svg>", segment.indexOf("grid"));
    if (svgClose === -1) {
      continue;
    }

    const afterSvg = segment.slice(svgClose + 6);
    const titleClose = afterSvg.indexOf("</div>");
    const rawTitle =
      titleClose === -1 ? afterSvg : afterSvg.slice(0, titleClose);
    const title = decodeEntities(
      rawTitle.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    );
    if (!title || seen.has(title)) {
      continue;
    }

    const stats = extractCategoryStats(segment, end);
    if (stats.length > 0) {
      categories.push({ title, stats });
      seen.add(title);
    }
  }

  return categories;
}

function extractCategoryStats(
  segment: string,
  segmentEnd: number,
): StatCard[] {
  const cardRe = /class="flex flex-col items-center bg-\[#121212\][^"]*py-4"/g;
  const stats: StatCard[] = [];

  let card: RegExpExecArray | null;
  const cards: { start: number }[] = [];
  while ((card = cardRe.exec(segment)) !== null) {
    cards.push({ start: card.index });
  }

  for (let i = 0; i < cards.length; i += 1) {
    const cardStart = cards[i].start;
    const cardEnd = i + 1 < cards.length ? cards[i + 1].start : segmentEnd;
    const cardHtml = segment.slice(cardStart, cardEnd);

    const valueMatch = cardHtml.match(
      /text-5xl font-bold[^>]*>([^<]*)<\/span>/,
    );
    const value = valueMatch ? decodeEntities(valueMatch[1]) : "";

    let label = "";
    if (valueMatch) {
      const after = cardHtml.slice(valueMatch.index! + valueMatch[0].length);
      label = decodeEntities(after.split("<")[0]);
    }

    if (!value || !label) {
      continue;
    }

    stats.push({ value, label });
  }

  return stats;
}

export async function getThescapeStats(
  slug: string | null | undefined,
): Promise<ThescapeStats> {
  if (!slug || slug.trim().length === 0) {
    return EMPTY_STATS;
  }

  const html = await fetchProfileHtml(slug.trim());
  if (!html) {
    return EMPTY_STATS;
  }

  return {
    level: extractLevel(html),
    playTime: extractValue(html, "Spielzeit"),
    coins: extractValue(html, "Münzen"),
  };
}

export async function getFullThescapeProfile(
  slug: string | null | undefined,
): Promise<FullPlayerProfile> {
  if (!slug || slug.trim().length === 0) {
    return { name: "", categories: [] };
  }

  const html = await fetchProfileHtml(slug.trim());
  if (!html) {
    return { name: "", categories: [] };
  }

  return {
    name: extractName(html),
    level: extractLevel(html) || undefined,
    playTime: extractValue(html, "Spielzeit") || undefined,
    lastSeen: extractLastSeen(html) || undefined,
    coins: extractValue(html, "Münzen") || undefined,
    categories: extractCategories(html),
  };
}
