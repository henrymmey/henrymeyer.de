import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://hmtclan.de";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}