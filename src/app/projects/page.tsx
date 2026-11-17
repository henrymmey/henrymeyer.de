import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import ProjectList from "@/components/project-list";
import { projects, sortProjectsByPriority } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software, gaming, and hardware projects by Henry Meyer.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-5xl">
          All Projects
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed md:text-base">
          A collection of all my software, gaming, and hardware projects.
        </p>
      </section>
      <ProjectList projects={sortProjectsByPriority(projects)} />
      <SiteFooter />
    </main>
  );
}
