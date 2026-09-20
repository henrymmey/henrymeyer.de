import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, Mail } from "lucide-react";

import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 md:px-8">
      <div className="flex flex-1 flex-col justify-center gap-8 py-12 md:py-16">
        <section className="relative rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
          <img
            src="/commandblock.gif"
            alt="Animated command block"
            className="mb-6 h-40 w-full rounded-base object-cover sm:absolute sm:right-6 md:right-8 sm:top-1/2 sm:-translate-y-1/2 sm:mb-0 sm:aspect-square sm:h-[calc(100%-3rem)] sm:w-auto sm:rounded-none"
          />
          <div className="sm:pr-72 md:pr-80">
            <p className="mb-3 inline-flex items-center gap-2 rounded-base border border-main-foreground/40 bg-main-foreground/10 px-3 py-1 text-xs font-heading">
              <span className="font-mono text-[11px]">404</span>
              Seite nicht gefunden
            </p>
            <h1 className="mb-3 max-w-[24ch] text-3xl font-heading leading-tight sm:text-4xl">
              Diese Seite existiert nicht.
            </h1>
            <p className="text-base leading-relaxed">
              Die Seite wurde möglicherweise verschoben oder die URL ist falsch.
              Verwenden Sie eine der Schnelllinks unten, um mit der Erkundung
              des HMT Clan fortzufahren.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-base border border-border/30 bg-secondary-background px-3 py-1.5 text-sm font-heading text-foreground shadow-sm transition-opacity hover:opacity-80"
              >
                <Home className="size-4" />
                Zurück zur Startseite
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-base border border-border/30 bg-background px-3 py-1.5 text-sm font-heading text-foreground shadow-sm transition-opacity hover:opacity-80"
              >
                <Mail className="size-4" />
                Kontaktiere uns
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-base border border-border/30 bg-secondary-background p-5 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/30 bg-background px-3 py-1 text-xs font-heading text-foreground/70">
            <Compass className="size-4" />
            Schnelllinks
          </div>
          <p className="mb-4 text-sm leading-relaxed text-foreground/80">
            Beliebte Seiten im Überblick
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link
              href="/events"
              className="inline-flex items-center justify-between rounded-base border border-border/30 bg-background px-3 py-2 text-sm font-heading shadow-sm transition-opacity hover:opacity-80"
            >
              Events
              <span
                aria-hidden="true"
                className="font-mono text-xs text-foreground/70"
              >
                {"->"}
              </span>
            </Link>
            <Link
              href="/calendar"
              className="inline-flex items-center justify-between rounded-base border border-border/30 bg-background px-3 py-2 text-sm font-heading shadow-sm transition-opacity hover:opacity-80"
            >
              Kalender
              <span
                aria-hidden="true"
                className="font-mono text-xs text-foreground/70"
              >
                {"->"}
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-between rounded-base border border-border/30 bg-background px-3 py-2 text-sm font-heading shadow-sm transition-opacity hover:opacity-80"
            >
              Kontakt
              <span
                aria-hidden="true"
                className="font-mono text-xs text-foreground/70"
              >
                {"->"}
              </span>
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
