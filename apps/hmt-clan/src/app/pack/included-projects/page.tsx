import type { Metadata } from "next";
import PackBody from "@/components/pack/pack-body";
import JsonLd from "@/components/json-ld";
import { getPackPage } from "@/lib/modpack";
import { softwareAppSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Included Projects | HMT Pack",
  description:
    "Alle Mods, Shader und Ressourcenpakete im HMT Pack – dem Modpack des HMT Clans für das Spielen auf TheScape.",
  alternates: {
    canonical: "/pack/included-projects",
  },
};

export default async function PackIncludedProjectsPage() {
  const { blocks } = await getPackPage("included-projects");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PackBody blocks={blocks} />

      <JsonLd data={softwareAppSchema("/pack/included-projects")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "HMT Pack", path: "/pack" },
          { name: "Included Projects", path: "/pack/included-projects" },
        ])}
      />
    </div>
  );
}