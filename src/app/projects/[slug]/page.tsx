import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import { Arrow } from "@/components/ui";
import { getProjectsWithDetails, projects } from "@/lib/projects";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getProjectsWithDetails().map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project?.hasDetails
    ? {
        title: project.title,
        description: project.description,
        alternates: { canonical: `/projects/${slug}/` },
      }
    : {};
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project?.hasDetails) notFound();
  const { default: Description } = await import(
    `@/content/projects/${slug}.md`
  );

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <p className="mb-3 text-sm">
          <a className="underline" href="/projects/">
            Projects
          </a>{" "}
          / {project.title}
        </p>
        <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-5xl">
          {project.title}
        </h1>
        {project.role && (
          <p className="mb-3 text-sm font-heading text-main-foreground/80">
            {project.role}
          </p>
        )}
        <p className="max-w-3xl text-base leading-relaxed">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-base border border-border/30 bg-secondary-background px-3 py-1.5 text-sm font-heading text-foreground shadow-sm transition-opacity hover:opacity-80"
            >
              {link.label}
              <Arrow />
            </a>
          ))}
        </div>
      </section>
      <section className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
        <h2 className="mb-5 border-b border-border/30 pb-3 text-2xl font-heading md:text-3xl">
          Description
        </h2>
        <div className="space-y-4 text-sm leading-relaxed md:text-base [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-heading [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-heading [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:font-heading [&_a]:underline [&_a]:underline-offset-2">
          <Description />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
