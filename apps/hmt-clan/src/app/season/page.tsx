import type { Metadata } from "next";
import Link from "next/link";
import { CalendarRange } from "lucide-react";
import SiteFooter from "@/components/site-footer";
import PageIntro from "@/components/minecraft/page-intro";
import SectionHeading from "@/components/minecraft/section-heading";
import Reveal from "@/components/minecraft/reveal";
import JsonLd from "@/components/json-ld";
import { itemListSchema } from "@/lib/seo";
import { getSeasons, formatSeasonSpan, type SeasonConfig } from "@/lib/season";

export const metadata: Metadata = {
  title: "Seasons | HMT Clan",
  description: "Alle Seasons des HMT Clans auf einen Blick – mit Mitgliedern und Events.",
  alternates: {
    canonical: "/season",
  },
};

function SeasonCard({ season }: { season: SeasonConfig }) {
  return (
    <Link
      href={`/season/${season.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="texture texture-planks tex-24 relative border-b-2 border-black/50 bg-black/35 px-4 py-3">
        <div className="relative flex items-center gap-2">
          <CalendarRange
            className="size-4 shrink-0 text-[#f5f0e4]"
            aria-hidden="true"
          />
          <span className="font-pixel text-[10px] font-medium uppercase tracking-[0.08em] text-[#f5f0e4] drop-shadow-[0_1px_2px_rgb(0_0_0/0.9),0_1px_0_rgb(0_0_0/0.85)]">
            {formatSeasonSpan(season)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-pixel text-lg leading-snug text-main-foreground transition-colors duration-200 group-hover:text-grass">
          {season.name}
        </h3>
        <p className="mt-auto pt-4 font-pixel text-[10px] uppercase tracking-[0.12em] text-muted underline decoration-emerald/40 underline-offset-4 transition-colors group-hover:text-foreground">
          Zur Season →
        </p>
      </div>
    </Link>
  );
}

export default function SeasonsPage() {
  const seasons = getSeasons();

  return (
    <main>
      <PageIntro
        title="Seasons"
        description="Alle Seasons des HMT Clans auf einen Blick. Klicke auf eine Season, um die Mitglieder und Events dieser Zeit zu sehen."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <section>
          <SectionHeading title="Alle Seasons" />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seasons.map((season, index) => (
              <li key={season.slug}>
                <Reveal delay={Math.min(index * 60, 240)}>
                  <SeasonCard season={season} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd
        data={itemListSchema(
          seasons.map((season) => ({
            name: season.name,
            path: `/season/${season.slug}`,
            type: "CollectionPage",
          })),
        )}
      />

      <SiteFooter />
    </main>
  );
}