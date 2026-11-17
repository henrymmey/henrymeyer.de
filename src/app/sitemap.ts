import type { MetadataRoute } from "next";
import { getProjectsWithDetails } from "@/lib/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://henrymeyer.de";
  const routes = [
    "",
    "/projects/",
    "/contact/",
    "/links/",
    "/legal/imprint/",
    "/legal/privacy/",
    "/code-of-conduct/",
  ];
  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date("2026-11-17"),
      changeFrequency:
        route === ""
          ? ("monthly" as const)
          : route === "/projects/"
            ? ("weekly" as const)
            : ("yearly" as const),
      priority: route === "" ? 1 : route === "/projects/" ? 0.9 : 0.5,
    })),
    ...getProjectsWithDetails().map((project) => ({
      url: `${base}/projects/${project.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
