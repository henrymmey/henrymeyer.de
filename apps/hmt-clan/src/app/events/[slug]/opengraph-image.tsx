import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, loadOgFonts } from "@/lib/og-image";
import { getEventBySlug } from "@/lib/events";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function EventOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgCard
      title={event?.name ?? "HMT Clan"}
      subtitle={event ? `HMT Clan Event` : "Wir spielen auf TheScape"}
      badge={event ? event.date : ""}
    />,
    {
      ...size,
      fonts,
    },
  );
}