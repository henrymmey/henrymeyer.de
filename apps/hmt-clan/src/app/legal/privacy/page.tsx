import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import LegalBody from "@/components/legal-body";
import PageIntro from "@/components/minecraft/page-intro";
import BlockFrame from "@/components/minecraft/block-frame";
import { readFile } from "fs/promises";
import { join } from "path";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | HMT Clan",
  description: "Datenschutzerklärung für die HMT Clan Website.",
  alternates: {
    canonical: "/legal/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Datenschutzerklärung",
    description: "Datenschutzerklärung für die HMT Clan Website.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL || "https://hmtclan.de"}/legal/privacy`,
  },
};

export default async function PrivacyPage() {
  const content = await readFile(
    join(process.cwd(), "src/content/legal/privacy.md"),
    "utf-8",
  );

  return (
    <main>
      <PageIntro
        title="Datenschutzerklärung"
        description="Informationen zur Verarbeitung personenbezogener Daten und zu Ihren Datenschutzrechten."
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <BlockFrame
          header={
            <>
              <span className="rounded-block border border-black/40 bg-black/45 px-2.5 py-1 font-pixel text-[11px] uppercase tracking-[0.14em] text-[#f5f0e4]">
                Version · September 2026
              </span>
            </>
          }
          bodyClassName="p-5 md:p-8"
        >
          <LegalBody content={content} />
        </BlockFrame>
      </div>

      <SiteFooter />
    </main>
  );
}
