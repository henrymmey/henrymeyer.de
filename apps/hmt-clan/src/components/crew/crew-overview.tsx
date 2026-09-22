"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import SectionHeading from "@/components/minecraft/section-heading";
import Reveal from "@/components/minecraft/reveal";
import BlockFrame from "@/components/minecraft/block-frame";
import MinecraftButton from "@/components/minecraft/minecraft-button";

export type CrewSearchCard = {
  key: string;
  searchText: string;
  node: ReactNode;
};

type CrewOverviewProps = {
  cards: CrewSearchCard[];
};

export default function CrewOverview({ cards }: CrewOverviewProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return cards;
    }
    return cards.filter((card) => card.searchText.includes(q));
  }, [cards, query]);

  return (
    <section
      id="crew"
      className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16"
    >
      <SectionHeading
        title="Crew"
        description="Alle Mitglieder des HMT Clans auf einen Blick. Suche nach Name, Rolle oder Minecraft-Namen und klicke auf ein Mitglied für die Detailansicht."
      />

      <div className="relative mb-8 max-w-md">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Mitglied suchen…"
          aria-label="Mitglied suchen"
          className="w-full rounded-block border border-black/50 bg-surface-3 py-2.5 pl-11 pr-4 font-pixel text-xs uppercase tracking-[0.1em] text-foreground placeholder:text-[10px] placeholder:normal-case placeholder:text-muted/70 shadow-[inset_0_2px_0_rgb(0_0_0/0.25),0_1px_0_rgb(255_255_255/0.04)] outline-none transition-colors focus:border-emerald/60"
        />
      </div>

      {filtered.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
          {filtered.map((card, index) => (
            <li key={card.key}>
              <Reveal delay={Math.min(index * 45, 300)}>{card.node}</Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto max-w-2xl rounded-block border border-black/50 bg-surface-3 px-6 py-12 text-center shadow-card">
          <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_2px_0_rgb(0_0_0/0.5)]">
            <Image
              src="/textures/barrier.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="size-6 object-contain"
            />
          </span>
          <p className="font-pixel text-base uppercase tracking-wide text-foreground md:text-lg">
            Keine Mitglieder gefunden
          </p>
          <p className="mt-3 text-sm text-muted">
            Für &bdquo;{query}&ldquo; wurde kein passendes Crew-Mitglied
            gefunden. Versuche es mit einem anderen Namen.
          </p>
        </div>
      )}

      <Reveal delay={150}>
        <BlockFrame
          className="mt-8 md:mt-10"
          headerTexture="slime"
          header={
            <span className="flex items-center gap-2 font-pixel text-sm uppercase tracking-[0.14em] text-[#efe8d8] md:text-base">
              Du willst mitmachen?
            </span>
          }
          bodyClassName="flex flex-col items-start gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6"
        >
          <p className="text-sm leading-relaxed text-muted">
            Dann gucke hier vorbei und erfahre, wie du dem HMT Clan beitreten
            kannst.
          </p>
          <MinecraftButton href="/join" variant="primary" className="shrink-0">
            HMT Beitreten
          </MinecraftButton>
        </BlockFrame>
      </Reveal>
    </section>
  );
}
