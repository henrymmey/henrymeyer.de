import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Trophy } from "lucide-react";
import SiteFooter from "@/components/site-footer";
import CrewCard from "@/components/crew/crew-card";
import EventCard from "@/components/event-card";
import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import {
  getSeasonBySlug,
  getSeasonMembers,
  getSeasonEvents,
  formatSeasonSpan,
  seasonShowsEvents,
  getAllSeasonSlugs,
} from "@/lib/season";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSeasonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const season = getSeasonBySlug(slug);

  if (!season) {
    return {
      title: "Season Not Found",
      description: "The requested season could not be found.",
    };
  }

  return {
    title: `${season.name} | HMT Clan`,
    description: `${season.name} beim HMT Clan – ${formatSeasonSpan(season)}.`,
  };
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-block border border-dashed border-black/50 bg-surface-3/60 px-6 py-10 text-center">
      <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_2px_0_rgb(0_0_0/0.5)]">
        {icon}
      </span>
      <p className="font-pixel text-base uppercase tracking-wide text-foreground">
        {title}
      </p>
      <p className="mt-3 text-sm text-muted">{text}</p>
    </div>
  );
}

export default async function SeasonPage({ params }: Props) {
  const { slug } = await params;
  const season = getSeasonBySlug(slug);

  if (!season) {
    notFound();
  }

  const members = getSeasonMembers(slug);
  const events = getSeasonEvents(slug);

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
        <Link
          href="/season"
          className="mb-6 inline-flex items-center gap-1.5 font-pixel text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zurück zu allen Seasons
        </Link>

        <section className="overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card">
          <div className="texture texture-planks tex-24 relative border-b-2 border-black/50 bg-black/35 px-5 py-4">
            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <span className="font-pixel text-[11px] font-medium uppercase tracking-[0.08em] text-[#f5f0e4] drop-shadow-[0_1px_2px_rgb(0_0_0/0.9),0_1px_0_rgb(0_0_0/0.85)]">
                {formatSeasonSpan(season)}
              </span>
              <MinecraftBadge variant="grass">
                {members.length} Mitglieder
              </MinecraftBadge>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <h1 className="font-pixel text-2xl uppercase leading-tight text-foreground md:text-4xl">
              {season.name}
            </h1>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-6 flex items-center gap-2 font-pixel text-lg text-foreground md:text-xl">
            <Users className="size-5 text-grass" aria-hidden="true" />
            Mitglieder dieser Season
          </h2>
          {members.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
              {members.map((member) => (
                <li key={member.slug} className="h-full">
                  <CrewCard member={member} showStats={false} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Users className="size-6 text-muted" aria-hidden="true" />}
              title="Keine Mitglieder"
              text="Für diese Season konnten bisher keine Mitglieder gefunden werden."
            />
          )}
        </section>

        {seasonShowsEvents(season) && (
          <section className="mt-16">
            <h2 className="mb-6 flex items-center gap-2 font-pixel text-lg text-foreground md:text-xl">
              <Trophy className="size-5 text-grass" aria-hidden="true" />
              Events dieser Season
            </h2>
            {events.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <li key={event.slug}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<Trophy className="size-6 text-muted" aria-hidden="true" />}
                title="Keine Events"
                text="In dieser Season fanden bisher keine Events statt."
              />
            )}
          </section>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}