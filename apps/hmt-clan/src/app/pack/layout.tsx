import type { ReactNode } from "react";
import type { Metadata } from "next";
import PackNav from "@/components/pack/pack-nav";
import PageIntro from "@/components/minecraft/page-intro";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "HMT Pack | HMT Clan",
  description:
    "Das HMT Pack – Modpack vom HMT Clan zum Spielen auf dem TheScape-Server. Inklusive eigener Server-GUI.",
};

export default function PackLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <PageIntro title="HMT Pack" description="Das Modpack vom HMT Clan" />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="mb-8 lg:mb-0 lg:self-start lg:sticky lg:top-24">
            <PackNav />
          </aside>
          <div className="min-w-0">
            <div className="rounded-block border border-black/50 bg-surface-3 p-5 shadow-card md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
