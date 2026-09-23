import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, loadOgFonts } from "@/lib/og-image";
import { SITE_DESCRIPTION } from "@/lib/seo";

export const alt = SITE_DESCRIPTION;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgCard
      title="HMT Clan"
      subtitle="Wir spielen gemeinsam auf dem TheScape-Server"
    />,
    {
      ...size,
      fonts,
    },
  );
}