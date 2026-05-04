import Link from "next/link";

export default function ProjectsNotFound() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <p className="mb-3 text-sm font-heading uppercase tracking-wide text-main-foreground/80">
          Project Not Found
        </p>
        <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-5xl">
          This project does not exist
        </h1>
        <p className="max-w-2xl text-base leading-relaxed">
          The slug you opened is not available. Pick one of the listed projects
          from the overview.
        </p>
      </section>

      <section className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/subsite#projects"
            className="inline-flex items-center rounded-base border border-border/30 bg-main px-3 py-1.5 text-sm font-heading text-main-foreground shadow-sm transition-opacity hover:opacity-80"
          >
            Back to Projects
          </Link>
          <Link
            href="/subsite"
            className="inline-flex items-center rounded-base border border-border/30 bg-background px-3 py-1.5 text-sm font-heading text-foreground shadow-sm transition-opacity hover:opacity-80"
          >
            Go to Subsite Home
          </Link>
        </div>
      </section>
    </main>
  );
}
