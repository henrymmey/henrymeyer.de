"use client";

import { useEffect, useState } from "react";
import type { PackBlock, PackTab } from "@/lib/modpack-pages";
import LegalBody from "@/components/legal-body";
import { cn } from "@/lib/utils";

function TabBlock({ tabs, group }: { tabs: PackTab[]; group: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    function activateFromHash() {
      const match = /^#tab-panel-(\d+)-(\d+)$/.exec(window.location.hash);
      if (!match) return;
      const hashGroup = Number(match[1]);
      const hashIndex = Number(match[2]);
      if (hashGroup !== group || hashIndex >= tabs.length) return;
      setActive(hashIndex);
      document
        .getElementById(`tab-panel-${group}-${hashIndex}`)
        ?.scrollIntoView({ block: "nearest" });
    }

    activateFromHash();
    window.addEventListener("hashchange", activateFromHash);
    return () => window.removeEventListener("hashchange", activateFromHash);
  }, [group, tabs.length]);

  useEffect(() => {
    const match = /^#tab-panel-(\d+)-(\d+)$/.exec(window.location.hash);
    if (match && Number(match[1]) === group && Number(match[2]) === active) {
      document
        .getElementById(`tab-panel-${group}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [active, group]);

  return (
    <div className="my-6 overflow-hidden rounded-block border border-black/50 bg-surface-2 shadow-card">
      <div
        role="tablist"
        aria-label="Abschnitte"
        className="flex flex-wrap border-b-2 border-black/50 bg-black/10"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            id={`tab-${group}-${index}`}
            aria-selected={active === index}
            aria-controls={`tab-panel-${group}-${index}`}
            onClick={() => setActive(index)}
            className={cn(
              "border-r border-black/30 px-4 py-2.5 font-pixel text-[11px] uppercase tracking-[0.12em] transition-colors",
              active === index
                ? "bg-surface-3 text-grass shadow-[inset_0_-2px_0_rgb(52_211_153/0.6)]"
                : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`tab-panel-${group}-${active}`}
        aria-labelledby={`tab-${group}-${active}`}
        className="scroll-mt-[70px] p-5 md:p-6"
      >
        {renderBlocks(tabs[active].blocks, group)}
      </div>
    </div>
  );
}

function AsideBox({
  variant,
  blocks,
  depth,
}: {
  variant: "caution" | "info";
  blocks: PackBlock[];
  depth: number;
}) {
  return (
    <div
      className={cn(
        "my-6 rounded-block border px-5 py-4",
        variant === "caution"
          ? "border-redstone/50 bg-redstone/10"
          : "border-black/50 bg-surface-2",
      )}
    >
      <p
        className={cn(
          "mb-2 font-pixel text-[10px] uppercase tracking-[0.2em]",
          variant === "caution" ? "text-redstone" : "text-emerald",
        )}
      >
        {variant === "caution" ? "Achtung" : "Hinweis"}
      </p>
      <div>{renderBlocks(blocks, depth)}</div>
    </div>
  );
}

function LinkCardRow({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="my-6 inline-flex items-center gap-2 rounded-block border border-emerald/60 bg-emerald/10 px-4 py-2.5 font-pixel text-xs uppercase tracking-[0.12em] text-emerald shadow-[0_2px_0_rgb(0_0_0/0.5)] transition-all duration-150 hover:-translate-y-px hover:bg-emerald/20 hover:text-emerald active:translate-y-px active:shadow-none"
    >
      {title}
      <span aria-hidden="true" className="text-sm">
        →
      </span>
    </a>
  );
}

export function renderBlocks(blocks: PackBlock[], depth = 0) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "markdown":
        return <LegalBody key={index} content={block.md} />;
      case "tabs":
        return <TabBlock key={index} tabs={block.tabs} group={depth + 1} />;
      case "aside":
        return (
          <AsideBox key={index} variant={block.variant} blocks={block.blocks} depth={depth} />
        );
      case "linkcard":
        return <LinkCardRow key={index} title={block.title} href={block.href} />;
    }
  });
}

export default function PackBody({ blocks }: { blocks: PackBlock[] }) {
  return <div className="space-y-4">{renderBlocks(blocks)}</div>;
}