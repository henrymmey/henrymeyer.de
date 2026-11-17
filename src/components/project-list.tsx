import { ProjectCards } from "@/components/ui";
import type { Project } from "@/lib/projects";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm">
      <div className="mb-5 flex items-end justify-between border-b border-border/30 pb-3">
        <h2 className="text-2xl font-heading md:text-3xl">Projects</h2>
        <span className="font-mono text-xs uppercase tracking-[0.24em] text-foreground/70">
          02
        </span>
      </div>
      <ProjectCards items={projects} />
    </section>
  );
}
