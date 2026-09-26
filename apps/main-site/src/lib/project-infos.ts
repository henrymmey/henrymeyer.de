export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectInfo = {
  slug: string;
  title: string;
  description: string;
  role?: string;
  showRole?: boolean;
  showTags?: boolean;
  showDetailsButton?: boolean;
  showInSitemap?: boolean;
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
    slug: "hmlabs-gaming",
    title: "HMLabs Gaming",
    description: "Modpacks, resource packs, and mods for Minecraft.",
    role: "Founder",
    showRole: true,
    showTags: false,
    showDetailsButton: false,
    showInSitemap: false,
    tags: ["Java", "Design"],
    links: [
      {
        label: "Website",
        href: "https://gaming.hmlabs.eu",
      },
      {
        label: "Modrinth",
        href: "https://modrinth.com/organization/9zYhowm8",
      },
      {
        label: "GitHub",
        href: "https://github.com/HMLabs-Gaming",
      },
    ],
    priority: 2,
    publishedAt: "2026-03-09",
  },
  {
    slug: "akku-craft",
    title: "Akku-Craft",
    description:
      "A modular power-bank platform focused on hardware reliability and expandability.",
    role: "Co-Founder, Hardware Engineering",
    showRole: true,
    showTags: false,
    showDetailsButton: false,
    showInSitemap: false,
    tags: ["Arduino", "BMS", "Hardware"],
    links: [
      { label: "Website", href: "https://akku-craft.eu" },
      { label: "GitHub", href: "https://github.com/akku-craft" },
    ],
    priority: 1,
    publishedAt: "2025-10-25",
  },

  {
    slug: "awesome-ai-for-beginners",
    title: "Awesome AI for Beginners",
    description:
      "A curated list of resources for learning artificial intelligence.",
    role: "",
    showRole: false,
    showTags: false,
    showDetailsButton: false,
    showInSitemap: false,
    tags: ["AI", "Awesome List"],
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
    priority: 3,
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
