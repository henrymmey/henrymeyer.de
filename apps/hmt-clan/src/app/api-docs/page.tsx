import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import PageIntro from "@/components/minecraft/page-intro";
import ApiDocsSwagger from "@/components/api-docs/swagger-ui";

export const metadata: Metadata = {
  title: "API-Dokumentation | HMT Clan",
  description:
    "OpenAPI-3.1-Dokumentation der öffentlichen HMT-Clan-API: Events, Crew und TheScape-Statistiken.",
};

export default function ApiDocsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="API-Dokumentation"
        eyebrowIcon="chest"
        title="API-Dokumentation"
        description="Interaktive Dokumentation der öffentlichen HMT-Clan-API. Endpoints lassen sich aufklappen und direkt per „Try it out“ testen."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <ApiDocsSwagger />
      </div>

      <SiteFooter />
    </main>
  );
}