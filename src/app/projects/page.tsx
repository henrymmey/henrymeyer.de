import SectionHeading from "@/components/section-heading";
import SiteFooter from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import {
  getSubsiteProjects,
  type SubsiteProject,
} from "@/lib/subsite-projects";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

type ProjectsPageProps = {
  searchParams: Promise<{
    sortBy?: string;
    direction?: string;
  }>;
};

type SortBy = "priority" | "date";
type SortDirection = "asc" | "desc";

function normalizeSortBy(value?: string): SortBy {
  return value === "date" ? "date" : "priority";
}

function normalizeDirection(value?: string): SortDirection {
  return value === "desc" ? "desc" : "asc";
}

function SortButton({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-base border px-3 py-1.5 text-sm font-heading shadow-sm transition-opacity hover:opacity-80 ${
        active
          ? "border-border/30 bg-main text-main-foreground"
          : "border-border/30 bg-background text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

export const metadata: Metadata = {
  title: {
    absolute: "Projects | JumpStone Dev",
  },
};

function ProjectGrid({ projects }: { projects: SubsiteProject[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.slug}
          className="rounded-base border border-border/30 bg-secondary-background p-5 shadow-sm"
        >
          <h3 className="mb-3 text-xl font-heading">{project.title}</h3>
          <p className="mb-4 text-sm leading-relaxed text-foreground/80">
            {project.description}
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="mb-5 text-xs text-foreground/70">
            Priority: {project.priority} · Published: {project.publishedAt}
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 rounded-base border border-border/30 bg-background px-3 py-1.5 text-sm font-heading text-foreground shadow-sm transition-opacity hover:opacity-80"
            >
              Details
              <ArrowUpRight className="size-4" />
            </Link>

            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-base border border-border/30 bg-main px-3 py-1.5 text-sm font-heading text-main-foreground shadow-sm transition-opacity hover:opacity-80"
              >
                {link.label}
                <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const sortBy = normalizeSortBy(resolvedSearchParams.sortBy);
  const direction = normalizeDirection(resolvedSearchParams.direction);

  const projects = getSubsiteProjects({ sortBy, direction });

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-5xl">
          All Projects
        </h1>
        <p className="max-w-3xl text-base leading-relaxed">
          Sort all projects by priority or publication date, ascending or
          descending.
        </p>
      </section>

      <section className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm">
        <SectionHeading index="02" title="Sort" />
        <div className="mt-4 flex flex-wrap gap-2">
          <SortButton
            href="/projects?sortBy=priority&direction=asc"
            label="Priority Asc"
            active={sortBy === "priority" && direction === "asc"}
          />
          <SortButton
            href="/projects?sortBy=priority&direction=desc"
            label="Priority Desc"
            active={sortBy === "priority" && direction === "desc"}
          />
          <SortButton
            href="/projects?sortBy=date&direction=asc"
            label="Date Asc"
            active={sortBy === "date" && direction === "asc"}
          />
          <SortButton
            href="/projects?sortBy=date&direction=desc"
            label="Date Desc"
            active={sortBy === "date" && direction === "desc"}
          />
        </div>
      </section>

      <section className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm">
        <SectionHeading index="03" title="Projects" />
        <ProjectGrid projects={projects} />
      </section>

      <SiteFooter />
    </main>
  );
}
