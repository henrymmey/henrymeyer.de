import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/contact/verify", "/tor"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
