import type { Metadata } from "next";
import MeyerWolkeLegalShell from "@/components/meyerwolke-legal-shell";
import MeyerWolkePrivacyContent from "@/content/meyerwolke/legal/privacy.mdx";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the MeyerWolke subsite area.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | MeyerWolke",
    description: "Privacy policy for the MeyerWolke subsite area.",
    type: "website",
    url: `${baseUrl}/meyerwolke/legal/privacy`,
  },
  alternates: {
    canonical: `${baseUrl}/meyerwolke/legal/privacy`,
  },
};

export default function MeyerWolkePrivacyPage() {
  return (
    <MeyerWolkeLegalShell
      title="Datenschutz für MeyerWolke"
      lead="Diese Seite beschreibt die Datenverarbeitung für den MeyerWolke-Bereich und bleibt in Struktur und Ton unabhängig vom Portfolio-Auftritt."
    >
      <MeyerWolkePrivacyContent />
    </MeyerWolkeLegalShell>
  );
}
