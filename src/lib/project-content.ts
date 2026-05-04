import {
  getProjectInfoBySlug,
  getProjectInfosSorted,
  getProjectSlugs,
  type ProjectInfo,
  type ProjectSortBy,
  type SortDirection,
} from "@/lib/project-infos";

export type SubsiteProject = ProjectInfo;

type SubsiteProjectSortOptions = {
  sortBy?: ProjectSortBy;
  direction?: SortDirection;
};

const mdxImporters = {
  "js-gaming": () => import("@/content/subsite/projects/js-gaming.mdx"),
  "akku-craft": () => import("@/content/subsite/projects/akku-craft.mdx"),
  "link-shortener": () =>
    import("@/content/subsite/projects/link-shortener.mdx"),
} as const;

export function getSubsiteProjects(
  options: SubsiteProjectSortOptions = {},
): SubsiteProject[] {
  return getProjectInfosSorted(options);
}

export function getSubsiteProjectBySlug(slug: string): SubsiteProject | null {
  return getProjectInfoBySlug(slug);
}

export function getSubsiteProjectSlugs(): string[] {
  return getProjectSlugs();
}

export async function getSubsiteProjectContentBySlug(slug: string) {
  const importer = mdxImporters[slug as keyof typeof mdxImporters];

  if (!importer) {
    return null;
  }

  return importer();
}
