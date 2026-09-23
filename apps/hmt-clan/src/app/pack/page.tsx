import type { Metadata } from "next";
import PackBody from "@/components/pack/pack-body";
import JsonLd from "@/components/json-ld";
import { getPackPage } from "@/lib/modpack";
import { softwareAppSchema, breadcrumbSchema, PACK_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  title: "HMT Pack | HMT Clan",
  description: PACK_DESCRIPTION,
  alternates: {
    canonical: "/pack",
  },
};

export default async function PackPage() {
  const { blocks } = await getPackPage("");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PackBody blocks={blocks} />

      <JsonLd data={softwareAppSchema("/pack")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "HMT Pack", path: "/pack" },
        ])}
      />
    </div>
  );
}