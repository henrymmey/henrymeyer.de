import type { Metadata } from "next";
import MeyerWolkeLegalShell from "@/components/meyerwolke-legal-shell";
import MeyerWolkeImprintContent from "@/content/meyerwolke/legal/imprint.mdx";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de";

export const metadata: Metadata = {
  title: "Imprint",
  description: "Imprint for the MeyerWolke subsite area.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Imprint | MeyerWolke",
    description: "Imprint for the MeyerWolke subsite area.",
    type: "website",
    url: `${baseUrl}/meyerwolke/legal/imprint`,
  },
  alternates: {
    canonical: `${baseUrl}/meyerwolke/legal/imprint`,
  },
};

export default function MeyerWolkeImprintPage() {
  return (
    <MeyerWolkeLegalShell
      title="Impressum für MeyerWolke"
      lead="Diese Seite bündelt die Betreiber- und Kontaktinformationen für den MeyerWolke-Bereich in einem ruhig gestalteten, eigenständigen Layout."
    >
      <MeyerWolkeImprintContent />
    </MeyerWolkeLegalShell>
  );
}
