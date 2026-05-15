import SiteFooter from "@/components/site-footer";
import PrivacyContent from "@/content/legal/privacy.mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the JumpStone website.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy",
    description: "Privacy policy for the JumpStone website.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de"}/legal/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="mb-2 text-3xl font-heading md:text-4xl">
          Datenschutzerklärung
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed md:text-base">
          Informationen zur Verarbeitung personenbezogener Daten und zu Ihren
          Datenschutzrechten.
        </p>
      </section>

      <article className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
        <section className="rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <div className="space-y-4 text-sm leading-relaxed md:text-base [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-heading [&_h2:first-child]:mt-0 [&_p]:text-sm [&_p]:leading-relaxed md:[&_p]:text-base [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:font-heading [&_a]:underline [&_a]:underline-offset-2">
            <PrivacyContent />
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
