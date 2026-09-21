import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteFooter from "@/components/site-footer";
import EventBody from "@/components/event-body";
import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import MinecraftButton from "@/components/minecraft/minecraft-button";
import { EventIconView } from "@/components/events/event-material";
import {
  getEventBySlug,
  getEventDescription,
  getAllEventSlugs,
} from "@/lib/events";
import type { EventConfig } from "@/lib/events/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: `${event.name} | HMT Clan`,
    description: event.description,
  };
}

function formatDate(event: EventConfig): string {
  const date = new Date(event.date + "T00:00:00").toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return event.showTime && event.time ? `${date} · ${event.time} Uhr` : date;
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const description = await getEventDescription(slug);

  return (
    <main>
      <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1.5 font-pixel text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zu den Events
        </Link>

        <article className="overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card">
          <div className="texture texture-planks tex-24 relative border-b-2 border-black/50 bg-black/35 px-5 py-4">
            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <span className="font-pixel text-[11px] font-medium uppercase tracking-[0.08em] text-[#f5f0e4] drop-shadow-[0_1px_2px_rgb(0_0_0/0.9),0_1px_0_rgb(0_0_0/0.85)]">
                {formatDate(event)}
              </span>
              {event.done && (
                <MinecraftBadge variant="redstone">Vorbei</MinecraftBadge>
              )}
            </div>
          </div>

          <div className="p-6 md:p-10">
            <span className="mb-5 flex size-12 items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.05),inset_0_-3px_0_rgb(0_0_0/0.4),0_2px_0_rgb(0_0_0/0.4)]">
              <EventIconView icon={event.icon} className="size-6" />
            </span>

            <h1 className="font-pixel text-2xl uppercase leading-tight text-foreground md:text-4xl">
              {event.name}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
              {event.description}
            </p>

            {event.links && event.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {event.links.map((link) => (
                  <MinecraftButton key={link.url} href={link.url} external variant="stone">
                    {link.displayName}
                  </MinecraftButton>
                ))}
              </div>
            )}

            {description && (
              <div className="mt-8 border-t border-white/5 pt-8">
                <EventBody body={description} />
              </div>
            )}
          </div>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
