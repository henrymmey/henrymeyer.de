import SiteFooter from "@/components/site-footer";
import Hero from "@/components/hero/hero";
import Countdown from "@/components/countdown/countdown";
import EventCard from "@/components/event-card";
import EventsEmpty from "@/components/events/events-empty";
import SectionHeading from "@/components/minecraft/section-heading";
import Reveal from "@/components/minecraft/reveal";
import CrewCard from "@/components/crew/crew-card";
import CrewJoinCard from "@/components/crew/crew-join-card";
import CalendarWidget from "@/components/calendar/calendar-widget";
import { crew } from "@/lib/crew";
import {
  getHomepageEvents,
  getNextEvent,
  getEventStartTimestamp,
  getEventTargetLabel,
} from "@/lib/events";

export const dynamic = "force-dynamic";

export default function Page() {
  const members = [...crew].sort((a, b) => a.priority - b.priority);
  const events = getHomepageEvents();
  const nextEvent = getNextEvent();

  return (
    <main>
      <Hero />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {nextEvent && (
          <Countdown
            targetTimestamp={getEventStartTimestamp(nextEvent)}
            targetLabel={getEventTargetLabel(nextEvent)}
          />
        )}

        <section id="events" className="py-8 md:py-16">
          <SectionHeading
            title="Events"
            description="Was steht an? Alle kommenden Events und Ankündigungen des HMT Clans auf einen Blick."
          />
          {events.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <li key={event.slug}>
                  <Reveal delay={index * 60}>
                    <EventCard event={event} />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <Reveal>
              <EventsEmpty />
            </Reveal>
          )}
        </section>

        <section id="crew" className="py-8 md:py-16">
          <SectionHeading
            title="Crew"
            description="Die Gesichter hinter HMT Clan. Klicke auf ein Mitglied, um mehr zu erfahren."
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
            {members.map((member, index) => (
              <li key={member.minecraftUser}>
                <Reveal delay={Math.min(index * 40, 300)}>
                  <CrewCard member={member} />
                </Reveal>
              </li>
            ))}
            <li>
              <Reveal delay={Math.min(members.length * 40, 300)}>
                <CrewJoinCard />
              </Reveal>
            </li>
          </ul>
        </section>

        <section id="kalender" className="py-8 md:py-16">
          <SectionHeading
            title="Kalender"
            description="Unsere Termine und geplanten Aktivitäten – direkt aus dem Google Kalender."
          />
          <CalendarWidget />
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}