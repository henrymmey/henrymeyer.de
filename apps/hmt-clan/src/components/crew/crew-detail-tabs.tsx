"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChartColumn,
  Check,
  ChevronDown,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AchievementProgress,
  Advancement,
  StatCard,
  StatCategory,
} from "@/lib/thescape";

type CrewDetailTabsProps = {
  categories: StatCategory[];
  achievements: AchievementProgress | null;
};

const TABS = [
  { id: "stats", label: "Statistiken", icon: ChartColumn },
  { id: "achievements", label: "Erfolge", icon: Trophy },
] as const;

type TabId = (typeof TABS)[number]["id"];

type SortKey = "standard" | "date-asc" | "date-desc";

const SORT_OPTIONS: { id: SortKey; label: string; hint: string }[] = [
  { id: "standard", label: "Standard", hint: "Alles anzeigen" },
  { id: "date-asc", label: "Datum aufsteigend", hint: "Älteste zuerst" },
  { id: "date-desc", label: "Datum absteigend", hint: "Neueste zuerst" },
];

const SORT_URL_VALUES: Record<SortKey, string> = {
  standard: "standard",
  "date-asc": "aufsteigend",
  "date-desc": "absteigend",
};

const TAB_URL_VALUES: Record<TabId, string> = {
  stats: "stats",
  achievements: "erfolge",
};

function parseTab(value: string | null): TabId {
  if (value === "erfolge" || value === "achievements") {
    return "achievements";
  }
  return "stats";
}

function parseSort(value: string | null): SortKey {
  if (value === "aufsteigend") {
    return "date-asc";
  }
  if (value === "absteigend") {
    return "date-desc";
  }
  return "standard";
}

function parseShowLocked(value: string | null): boolean {
  if (value === null) {
    return true;
  }
  return value !== "0" && value !== "false";
}

function StatCardTile({ stat }: { stat: StatCard }) {
  return (
    <div className="rounded-block border border-black/60 bg-surface-3 p-5 text-center shadow-card transition-transform duration-200 hover:-translate-y-px">
      <p className="font-pixel text-2xl font-semibold text-emerald md:text-3xl">
        {stat.value}
      </p>
      <p className="mt-1 text-xs text-muted md:text-sm">{stat.label}</p>
    </div>
  );
}

function CategorySection({ category }: { category: StatCategory }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 font-pixel text-lg text-foreground md:text-xl">
        <TrendingUp className="size-5 text-grass" aria-hidden="true" />
        {category.title}
      </h2>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {category.stats.map((stat) => (
          <li key={`${category.title}-${stat.label}`}>
            <StatCardTile stat={stat} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProgressBar({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full border border-black/60 bg-black/60 shadow-[inset_0_2px_4px_rgb(0_0_0/0.5)]",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-grass-dark via-grass to-emerald"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function AdvancementCard({ advancement }: { advancement: Advancement }) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-block border p-3 shadow-card transition-colors",
        advancement.unlocked
          ? "border-black/60 bg-surface-3"
          : "border-black/40 bg-surface-2/60",
      )}
    >
      <Image
        src={advancement.icon}
        alt=""
        width={80}
        height={80}
        className={cn(
          "size-9 shrink-0 object-contain p-0.5",
          !advancement.unlocked && "opacity-40 grayscale",
        )}
      />
      <div className="min-w-0">
        <h4
          className={cn(
            "font-pixel text-[11px] uppercase leading-tight tracking-wide",
            advancement.unlocked ? "text-grass" : "text-muted",
          )}
        >
          {advancement.title}
        </h4>
        {advancement.description && (
          <p className="mt-1 text-xs text-muted">{advancement.description}</p>
        )}
        {advancement.unlockedAt && (
          <p className="mt-1 text-[10px] text-emerald/80">
            Freigeschaltet am {advancement.unlockedAt}
          </p>
        )}
      </div>
    </li>
  );
}

function parseUnlockedDate(raw?: string): number | null {
  if (!raw) {
    return null;
  }
  const match =
    /(\d{2})\.(\d{2})\.(\d{4})(?: um (\d{2}):(\d{2}))?/.exec(raw);
  if (!match) {
    return null;
  }
  const date = new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]),
    match[4] ? Number(match[4]) : 0,
    match[5] ? Number(match[5]) : 0,
  );
  return date.getTime();
}

function filterGroups(
  groups: AchievementProgress["groups"],
  query: string,
  sort: SortKey,
  showLocked: boolean,
) {
  const q = query.trim().toLowerCase();
  const dir = sort === "date-asc" ? 1 : -1;

  return groups
    .map((group) => {
      let items = group.advancements;
      if (!showLocked) {
        items = items.filter((advancement) => advancement.unlocked);
      }
      if (q) {
        items = items.filter(
          (advancement) =>
            advancement.title.toLowerCase().includes(q) ||
            advancement.description.toLowerCase().includes(q),
        );
      }
      if (sort !== "standard") {
        const sorted = [...items];
        sorted.sort((a, b) => {
          const aDate = parseUnlockedDate(a.unlockedAt);
          const bDate = parseUnlockedDate(b.unlockedAt);
          if (aDate !== null && bDate !== null) {
            return (aDate - bDate) * dir;
          }
          if (aDate !== null) {
            return -1;
          }
          if (bDate !== null) {
            return 1;
          }
          return 0;
        });
        items = sorted;
      }
      return { ...group, advancements: items };
    })
    .filter((group) => group.advancements.length > 0);
}

export default function CrewDetailTabs({
  categories,
  achievements,
}: CrewDetailTabsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const urlQuery = searchParams?.get("suche") ?? "";

  const [query, setQuery] = useState(urlQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const typingRef = useRef(false);

  const activeTab = parseTab(searchParams?.get("tab") ?? null);
  const sort = parseSort(searchParams?.get("sort") ?? null);
  const showLocked = parseShowLocked(searchParams?.get("gesperrt") ?? null);

  const updateUrl = useCallback(
    ({
      tab,
      suche,
      sort: nextSort,
      gesperrt,
    }: {
      tab?: TabId;
      suche?: string | null;
      sort?: SortKey;
      gesperrt?: boolean;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab !== undefined) {
        params.set("tab", TAB_URL_VALUES[tab]);
      }
      if (suche !== undefined) {
        if (suche) {
          params.set("suche", suche);
        } else {
          params.delete("suche");
        }
      }
      if (nextSort !== undefined) {
        params.set("sort", SORT_URL_VALUES[nextSort]);
      }
      if (gesperrt !== undefined) {
        params.set("gesperrt", gesperrt ? "1" : "0");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      typingRef.current = false;
      if (query !== urlQuery) {
        updateUrl({ suche: query });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, urlQuery, updateUrl]);

  useEffect(() => {
    if (!typingRef.current && query !== urlQuery) {
      const timer = setTimeout(() => setQuery(urlQuery), 0);
      return () => clearTimeout(timer);
    }
  }, [urlQuery, query]);

  const hasStats = categories.length > 0;
  const hasAchievements = achievements !== null;
  const tabs = TABS.filter(
    (tab) =>
      (tab.id === "stats" && hasStats) ||
      (tab.id === "achievements" && hasAchievements),
  );

  const current = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : tabs[0]?.id;

  const filteredGroups = useMemo(
    () =>
      achievements
        ? filterGroups(achievements.groups, query, sort, showLocked)
        : [],
    [achievements, query, sort, showLocked],
  );

  return (
    <div>
      {tabs.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = current === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => updateUrl({ tab: tab.id })}
                className={cn(
                  "inline-flex items-center gap-2 rounded-block border px-4 py-2 font-pixel text-xs uppercase tracking-[0.12em] transition-colors",
                  isActive
                    ? "border-emerald/60 bg-surface-2 text-grass shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_1px_0_rgb(0_0_0/0.4)]"
                    : "border-black/50 bg-surface-3 text-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {current === "stats" && (
        <div className="space-y-10">
          {categories.map((category) => (
            <CategorySection key={category.title} category={category} />
          ))}
        </div>
      )}

      {current === "achievements" && hasAchievements && (
        <div className="space-y-10">
          <div className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-pixel text-sm uppercase tracking-wide text-foreground">
                <Trophy className="size-4 text-grass" aria-hidden="true" />
                Gesamtfortschritt
              </h3>
              <p className="font-pixel text-sm text-grass">
                {achievements.unlocked}/{achievements.total} &middot;{" "}
                {achievements.percent}%
              </p>
            </div>
            <ProgressBar percent={achievements.percent} />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:w-80">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                        setQuery(event.target.value);
                        typingRef.current = true;
                      }}
                placeholder="Erfolge durchsuchen…"
                aria-label="Erfolge durchsuchen"
                className="w-full rounded-block border border-black/50 bg-surface-3 py-2.5 pl-10 pr-4 font-pixel text-xs uppercase tracking-[0.1em] text-foreground placeholder:text-[10px] placeholder:normal-case placeholder:text-muted/70 shadow-[inset_0_2px_0_rgb(0_0_0/0.25),0_1px_0_rgb(255_255_255/0.04)] outline-none transition-colors focus:border-emerald/60"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-block border px-3.5 py-2.5 font-pixel text-xs uppercase tracking-[0.1em] transition-colors",
                  menuOpen
                    ? "border-emerald/60 bg-surface-2 text-grass"
                    : "border-black/50 bg-surface-3 text-muted hover:text-foreground",
                )}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Sortierung
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    menuOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-hidden="true"
                    tabIndex={-1}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-72 rounded-block border border-black/60 bg-surface-3 p-2 shadow-card"
                  >
                    <p className="px-3 pb-1 pt-2 font-pixel text-[9px] uppercase tracking-[0.2em] text-muted">
                      Sortierung
                    </p>
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={sort === option.id}
                        onClick={() => updateUrl({ sort: option.id })}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-block border px-3 py-2 text-left transition-colors",
                          sort === option.id
                            ? "border-emerald/50 bg-surface-2 text-grass"
                            : "border-transparent text-muted hover:bg-surface-2 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-[2px] border",
                            sort === option.id
                              ? "border-emerald/60 bg-grass/15"
                              : "border-black/50 bg-black/40",
                          )}
                        >
                          {sort === option.id && (
                            <Check className="size-3" aria-hidden="true" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-pixel text-[10px] uppercase tracking-[0.1em]">
                            {option.label}
                          </span>
                          <span className="block truncate text-[10px] text-muted">
                            {option.hint}
                          </span>
                        </span>
                      </button>
                    ))}

                    <div className="my-2 h-px bg-black/60" />

                    <button
                      type="button"
                      role="menuitemcheckbox"
                      aria-checked={showLocked}
                      onClick={() => updateUrl({ gesperrt: !showLocked })}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-block border px-3 py-2 text-left transition-colors",
                        showLocked
                          ? "border-emerald/50 bg-surface-2 text-grass"
                          : "border-transparent text-muted hover:bg-surface-2 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-[2px] border",
                          showLocked
                            ? "border-emerald/60 bg-grass/15"
                            : "border-black/50 bg-black/40",
                        )}
                      >
                        {showLocked && (
                          <Check className="size-3" aria-hidden="true" />
                        )}
                      </span>
                      <span className="font-pixel text-[10px] uppercase tracking-[0.1em]">
                        Gesperrte anzeigen
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <section key={group.title}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-pixel text-lg text-foreground md:text-xl">
                    {group.title}
                  </h3>
                  <p className="font-pixel text-xs text-grass">
                    {group.unlocked}/{group.total} &middot; {group.percent}%
                  </p>
                </div>
                <ProgressBar percent={group.percent} className="mb-5" />
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                  {group.advancements.map((advancement) => (
                    <AdvancementCard
                      key={`${group.title}-${advancement.title}`}
                      advancement={advancement}
                    />
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <div className="mx-auto max-w-2xl rounded-block border border-dashed border-black/50 bg-surface-3/60 px-6 py-10 text-center">
              <p className="font-pixel text-base uppercase tracking-wide text-foreground md:text-lg">
                Keine Erfolge gefunden
              </p>
              <p className="mt-3 text-sm text-muted">
                Für deine Suche oder Filter wurde kein passender Erfolg
                gefunden. Versuche es mit einem anderen Begriff.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}