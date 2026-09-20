export type PackBlock =
  | { kind: "markdown"; md: string }
  | { kind: "tabs"; tabs: PackTab[] }
  | { kind: "aside"; variant: "caution" | "info"; blocks: PackBlock[] }
  | { kind: "linkcard"; title: string; href: string };

export type PackTab = { label: string; blocks: PackBlock[] };

export type PackPage = {
  slug: string;
  label: string;
  href: string;
  file: string;
};

export const PACK_PAGES: PackPage[] = [
  { slug: "", label: "Overview", href: "/pack", file: "index.mdx" },
  {
    slug: "installation",
    label: "Installation",
    href: "/pack/installation",
    file: "installation.mdx",
  },
  {
    slug: "included-projects",
    label: "Included Projects",
    href: "/pack/included-projects",
    file: "included-projects.mdx",
  },
];