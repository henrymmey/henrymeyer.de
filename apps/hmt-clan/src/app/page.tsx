import SiteFooter from "@/components/site-footer";
import Countdown from "@/components/countdown";
import EventCard from "@/components/event-card";
import DiscordWidget from "@/components/discord-widget";
import CalendarWidget from "@/components/calendar-widget";
import CrewCard from "@/components/crew-card";
import { crew } from "@/lib/crew";
import { getHomepageEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default function Page() {
  const members = [...crew].sort((a, b) => a.priority - b.priority);
  const events = getHomepageEvents();

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
      <section className="mb-8 mt-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-5xl">
          <span className="text-foreground">HMT Clan</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed">
          HMT Clan, die Gruppe von Freunden die auf TheScape zusammen Minecraft
          spielt.
        </p>
      </section>

      <Countdown />

      <section id="events" className="mb-8">
        <h2 className="mb-6 text-2xl font-heading text-foreground sm:text-3xl">
          Events
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
          <div className="rounded-base border border-dashed border-border/40 bg-main px-6 py-10 text-center font-base shadow-sm">
            <p className="mb-1 font-heading text-lg text-main-foreground">
              Keine Events in Planung
            </p>
            <p className="text-sm text-foreground/60">
              Aktuell sind keine Events veröffentlicht. Es sind aber bestimmt
              bereits welche in Planung – schau später noch einmal vorbei.
            </p>
          </div>
        )}
      </section>

      <section id="crew" className="mb-8">
        <h2 className="mb-6 text-2xl font-heading text-foreground sm:text-3xl">
          Crew
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {members.map((member) => (
            <li key={member.minecraftUser}>
              <CrewCard member={member} />
            </li>
          ))}
        </ul>
      </section>
      {/*
      <section id="discord" className="mb-8">
        <h2 className="mb-6 text-2xl font-heading text-foreground sm:text-3xl">
          Discord
        </h2>
        <DiscordWidget />
      </section>
      */}
      <section id="kalender" className="mb-8">
        <h2 className="mb-6 text-2xl font-heading text-foreground sm:text-3xl">
          Kalender
        </h2>
        <CalendarWidget />
      </section>

      <p className="mb-8 text-center text-sm text-foreground/40">
        NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH
        MOJANG OR MICROSOFT.
        <br />
        NICHT MIT THESCAPE VERBUNDEN.
      </p>
      <SiteFooter />
    </main>
  );
}
