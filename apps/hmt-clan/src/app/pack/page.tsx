import type { Metadata } from "next";
import PackBody from "@/components/pack/pack-body";
import { getPackPage } from "@/lib/modpack";

export const metadata: Metadata = {
  title: "HMT Pack | HMT Clan",
};

export default async function PackPage() {
  const { blocks } = await getPackPage("");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PackBody blocks={blocks} />
    </div>
  );
}