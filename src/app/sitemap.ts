import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/project-infos";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://jumpstone4477.de";

  const projectEntries = getProjectSlugs().map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2026-05-04"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/code-of-conduct`,
      lastModified: new Date("2026-04-29"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-05-04"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal/imprint`,
      lastModified: new Date("2026-04-29"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date("2026-04-29"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/links`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projectEntries,
  ];

  return routes;
}
