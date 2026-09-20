import type { Metadata } from "next";
import PackBody from "@/components/pack/pack-body";
import { getPackPage } from "@/lib/modpack";

export const metadata: Metadata = {
  title: "Included Projects | HMT Pack",
  description: "Alle Mods, Shader und Ressourcenpakete, die im HMT Pack enthalten sind.",
};

export default async function PackIncludedProjectsPage() {
  const { blocks } = await getPackPage("included-projects");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PackBody blocks={blocks} />
    </div>
  );
}