import type { Metadata } from "next";
import PackBody from "@/components/pack/pack-body";
import { getPackPage } from "@/lib/modpack";

export const metadata: Metadata = {
  title: "Installation | HMT Pack",
  description: "So installierst du das HMT Pack.",
};

export default async function PackInstallationPage() {
  const { blocks } = await getPackPage("installation");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PackBody blocks={blocks} />
    </div>
  );
}