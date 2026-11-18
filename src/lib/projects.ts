export type Project = {
  slug: string;
  title: string;
  description: string;
  role?: string;
  // When true, src/content/projects/{slug}.md is required and a detail page is generated.
  hasDetails: boolean;
  priority: number;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "akku-craft",
    title: "Akku-Craft",
    description:
      "A modular power-bank platform focused on hardware reliability and expandability.",
    role: "Co-Founder, Hardware Engineering",
    hasDetails: true,
    priority: 2,
    links: [
      { label: "Website", href: "https://akku-craft.eu" },
      { label: "GitHub", href: "https://github.com/akku-craft" },
    ],
  },
  {
    slug: "hmlabs-gaming",
    title: "HMLabs Gaming",
    description:
      "HMLabs Gaming is a collection of Minecraft projects focused on creating mods, plugins, modpacks and resource packs. The goal is to build reliable, well-designed and enjoyable projects for the Minecraft community.",
    role: "Founder",
    priority: 1,
    hasDetails: true,
    links: [
      { label: "Website", href: "https://gaming.hmlabs.eu" },
      { label: "Modrinth", href: "https://modrinth.com/organization/9zYhowm8" },
      { label: "GitHub", href: "https://github.com/HMLabs-Gaming" },
    ],
  },
  {
    slug: "projekt-ansichtssache",
    title: "Projekt Ansichtssache",
    description:
      "Projekt Ansichtssache is a student project focused on digital accessibility. Our goal is to make the web more inclusive through simple, accessible and easy-to-use tools.",
    hasDetails: true,
    role: "Developer, Maintainer",
    priority: 3,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Projekt-Ansichtssache",
      },
      { label: "Website", href: "https://projekt-ansichtssache.github.io/" },
    ],
  },
  {
    slug: "hmlabs",
    title: "HMLabs",
    description:
      "HMLabs is home to open source projects across software, tools, and Minecraft. Explore what we are building and find each project in its own space.",
    role: "Founder",
    priority: 4,
    hasDetails: true,
    links: [
      { label: "Website", href: "https://hmlabs.eu" },
      { label: "GitHub", href: "https://github.com/HMLabs-HQ" },
    ],
  },
  {
    slug: "awesome-ai-for-beginners",
    title: "Awesome AI for Beginners",
    description:
      "A curated list of resources to understand and use AI without any technical background.",
    hasDetails: false,
    priority: 5,
    links: [
      {
        label: "Repository",
        href: "https://github.com/henrymmey/awesome-ai-for-beginners",
      },
      { label: "Website", href: "https://aiforbeginners.henrymeyer.de" },
    ],
  },
  {
    slug: "untis-plan-dashboard",
    title: "Untis Plan Dashboard",
    description:
      "A modern dashboard and JSON API for parsing Untis substitution plan PDFs and serving class schedules.",
    hasDetails: false,
    priority: 6,
    links: [
      {
        label: "Repository",
        href: "https://github.com/henrymmey/untis-plan-dashboard",
      },
    ],
  },
  {
    slug: "authentik-users-to-improvmx-sync",
    title: "Authentik Users to Improvmx Sync",
    description:
      "Synchronize members of an Authentik group with ImprovMX email forwarding aliases.",
    hasDetails: false,
    priority: 7,
    links: [
      {
        label: "Repository",
        href: "https://github.com/henrymmey/authentik-users-to-improvmx-sync",
      },
    ],
  },
];

export function sortProjectsByPriority(projectList: Project[] = projects) {
  return [...projectList].sort((a, b) => a.priority - b.priority);
}

export function getProjectsWithDetails() {
  return projects.filter(({ hasDetails }) => hasDetails);
}
