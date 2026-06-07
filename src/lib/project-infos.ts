export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectInfo = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  priority: number;
  publishedAt: string;
};

export type ProjectSortBy = "priority" | "date";
export type SortDirection = "asc" | "desc";

type ProjectSortOptions = {
  sortBy?: ProjectSortBy;
  direction?: SortDirection;
};

const projectInfos: ProjectInfo[] = [
  {
    slug: "js-gaming",
    title: "JS Gaming",
    description:
      "Modpacks, resource packs, and technical tooling for Minecraft ecosystems.",
    tags: ["Part of HMLabs", "Java", "Game Tooling", "Design"],
    links: [
      {
        label: "Modrinth",
        href: "https://modrinth.com/organization/jumpstone-gaming",
      },
      { label: "GitHub", href: "https://github.com/jumpstone-gaming" },
    ],
    priority: 3,
    publishedAt: "2026-03-09",
  },
  {
    slug: "akku-craft",
    title: "Akku-Craft",
    description:
      "A modular power-bank platform focused on hardware reliability and expandability.",
    tags: ["Arduino", "BMS", "Hardware"],
    links: [
      { label: "GitHub", href: "https://github.com/akku-craft" },
      { label: "Wiki", href: "https://github.com/akku-craft/wiki/wiki" },
    ],
    priority: 1,
    publishedAt: "2025-10-25",
  },
  {
    slug: "link-shortener",
    title: "Link Shortener",
    description:
      "A private URL shortener built with JavaScript and deployed on Cloudflare Workers.",
    tags: ["JavaScript", "Cloudflare Workers"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/henrymmey/link-shortener",
      },
    ],
    priority: 4,
    publishedAt: "2026-04-01",
  },
  {
    slug: "awesome-ai-for-beginners",
    title: "Awesome AI for Beginners",
    description:
      "A curated list of resources for learning artificial intelligence.",
    tags: ["Part of HMLabs", "AI", "Awesome List"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/henrymmey/awesome-ai-for-beginners",
      },
      {
        label: "Website",
        href: "https://aiforbeginners.henrymeyer.de",
      },
    ],
    priority: 2,
    publishedAt: "2026-05-10",
  },
];

export function getProjectInfos(): ProjectInfo[] {
  return projectInfos;
}

export function getProjectInfoBySlug(slug: string): ProjectInfo | null {
  return projectInfos.find((project) => project.slug === slug) ?? null;
}

export function getProjectSlugs(): string[] {
  return projectInfos.map((project) => project.slug);
}

export function getProjectInfosSorted(
  options: ProjectSortOptions = {},
): ProjectInfo[] {
  const { sortBy = "priority", direction = "asc" } = options;

  return [...projectInfos].sort((a, b) => {
    const priorityDiff = a.priority - b.priority;
    const dateDiff = Date.parse(a.publishedAt) - Date.parse(b.publishedAt);

    if (sortBy === "priority") {
      const primary = direction === "asc" ? priorityDiff : -priorityDiff;
      if (primary !== 0) {
        return primary;
      }

      return direction === "asc" ? -dateDiff : dateDiff;
    }

    const primary = direction === "asc" ? dateDiff : -dateDiff;
    if (primary !== 0) {
      return primary;
    }

    return direction === "asc" ? priorityDiff : -priorityDiff;
  });
}

export function getProjectInfosSortedByPriority(): ProjectInfo[] {
  return getProjectInfosSorted({ sortBy: "priority", direction: "asc" });
}

export function getNewestProjectInfos(count: number): ProjectInfo[] {
  return getProjectInfosSortedByPriority().slice(0, count);
}
