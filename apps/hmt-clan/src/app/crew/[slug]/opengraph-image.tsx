import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, loadOgFonts } from "@/lib/og-image";
import { getCrewMemberBySlug, getMemberRoles } from "@/lib/crew";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function CrewOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getCrewMemberBySlug(slug);

  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgCard
      title={member?.name ?? "HMT Clan"}
      subtitle={
        member
          ? `${member.minecraftUser} · ${getMemberRoles(member).join(", ")}`
          : "Wir spielen auf TheScape"
      }
      badge="HMT Clan Crew"
    />,
    {
      ...size,
      fonts,
    },
  );
}