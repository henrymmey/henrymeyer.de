import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import EventCard from "@/components/event-card";
import EventsEmpty from "@/components/events/events-empty";
import PageIntro from "@/components/minecraft/page-intro";
import SectionHeading from "@/components/minecraft/section-heading";
import Reveal from "@/components/minecraft/reveal";
import JsonLd from "@/components/json-ld";
import { getVisibleEvents } from "@/lib/events";
import { itemListSchema } from "@/lib/seo";
import type { EventConfig } from "@/lib/events/types";

export const metadata: Metadata = {
  title: "Events | HMT Clan",
  description: "Alle Events und Ankündigungen des HMT Clans auf einen Blick.",
  alternates: {
    canonical: "/events",
  },
};

function EventGrid({ events }: { events: EventConfig[] }) {
  if (events.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <li key={event.slug}>
          <Reveal delay={Math.min(index * 60, 240)}>
            <EventCard event={event} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default function EventsPage() {
  const events = getVisibleEvents();

  const upcoming = events.filter((e) => !e.done);
  const past = events.filter((e) => e.done);

  return (
    <main>
      <PageIntro
        title="Events"
        description="Alle Events und Ankündigungen des HMT Clans auf einen Blick."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
        {upcoming.length === 0 && past.length === 0 ? (
          <Reveal>
            <EventsEmpty />
          </Reveal>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-14">
                <SectionHeading title="Kommende Events" />
                <EventGrid events={upcoming} />
              </section>
            )}

            {past.length > 0 && (
              <section>
                <SectionHeading title="Vergangene Events" />
                <EventGrid events={past} />
              </section>
            )}
          </>
        )}
      </div>

      <JsonLd
        data={itemListSchema(
          getVisibleEvents().map((event) => ({
            name: event.name,
            path: `/events/${event.slug}`,
            type: "Event",
          })),
        )}
      />

      <SiteFooter />
    </main>
  );
}
