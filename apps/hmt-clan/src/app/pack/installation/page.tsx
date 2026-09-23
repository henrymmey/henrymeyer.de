import type { Metadata } from "next";
import PackBody from "@/components/pack/pack-body";
import JsonLd from "@/components/json-ld";
import { getPackPage } from "@/lib/modpack";
import { softwareAppSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Installation | HMT Pack",
  description:
    "So installierst du das HMT Pack – das Modpack, mit dem der HMT Clan auf dem TheScape-Server spielt.",
  alternates: {
    canonical: "/pack/installation",
  },
};

export default async function PackInstallationPage() {
  const { blocks } = await getPackPage("installation");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PackBody blocks={blocks} />

      <JsonLd data={softwareAppSchema("/pack/installation")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "HMT Pack", path: "/pack" },
          { name: "Installation", path: "/pack/installation" },
        ])}
      />
    </div>
  );
}