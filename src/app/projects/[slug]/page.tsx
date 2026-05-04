import SiteFooter from "@/components/site-footer";
import {
  getSubsiteProjectBySlug,
  getSubsiteProjectContentBySlug,
  getSubsiteProjectSlugs,
} from "@/lib/subsite-projects";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const baseUrl =
  process.env.NEXT_PUBLIC_SUBSITE_URL || "https://jumpstone.is-a.dev";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSubsiteProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getSubsiteProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const canonicalUrl = `${baseUrl}/projects/${project.slug}`;

  return {
    title: {
      absolute: `${project.title} | JumpStone Dev`,
    },
    description: project.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${project.title} | JumpStone Dev`,
      description: project.description,
      type: "article",
      url: canonicalUrl,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${project.title} - Project Overview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | JumpStone Dev`,
      description: project.description,
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getSubsiteProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const contentModule = await getSubsiteProjectContentBySlug(slug);

  if (!contentModule) {
    notFound();
  }

  const ProjectContent = contentModule.default;

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <p className="mb-3 text-sm font-heading uppercase tracking-wide text-main-foreground/80">
          Project Overview
        </p>
        <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed">
          {project.description}
        </p>
      </section>

      <article className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
        <section className="rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <div className="space-y-4 text-sm leading-relaxed md:text-base [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-heading [&_h2:first-child]:mt-0 [&_p]:text-sm [&_p]:leading-relaxed md:[&_p]:text-base [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:font-heading [&_a]:underline [&_a]:underline-offset-2">
            <ProjectContent />
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/projects"
            className="inline-flex items-center rounded-base border border-border/30 bg-main px-3 py-1.5 text-sm font-heading text-main-foreground shadow-sm transition-opacity hover:opacity-80"
          >
            Back to Projects
          </Link>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-base border border-border/30 bg-secondary-background px-3 py-1.5 text-sm font-heading shadow-sm transition-opacity hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
