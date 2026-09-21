"use client";

import { useState } from "react";
import Image from "next/image";
import { ChartColumn, TrendingUp, Trophy } from "lucide-react";
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

export default function CrewDetailTabs({
  categories,
  achievements,
}: CrewDetailTabsProps) {
  const [active, setActive] = useState<TabId>("stats");

  const hasStats = categories.length > 0;
  const hasAchievements = achievements !== null;
  const tabs = TABS.filter(
    (tab) =>
      (tab.id === "stats" && hasStats) ||
      (tab.id === "achievements" && hasAchievements),
  );

  const current = tabs.some((tab) => tab.id === active)
    ? active
    : tabs[0]?.id;

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
                onClick={() => setActive(tab.id)}
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

          {achievements.groups.map((group) => (
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
          ))}
        </div>
      )}
    </div>
  );
}