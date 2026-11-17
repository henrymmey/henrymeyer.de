import type { ReactNode } from "react";

export function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between border-b border-border/30 pb-3">
      <h2 className="text-2xl font-heading md:text-3xl">{title}</h2>
      <span className="font-mono text-xs uppercase tracking-[0.24em] text-foreground/70">
        {index}
      </span>
    </div>
  );
}

export function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
    >
      <path
        d="M7 17 17 7M7 7h10v10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProjectCards({
  items,
}: {
  items: {
    slug: string;
    title: string;
    description: string;
    role?: string;
    hasDetails: boolean;
    links: { label: string; href: string }[];
  }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((project) => (
        <article
          key={project.slug}
          className="rounded-base border border-border/30 bg-secondary-background p-5 shadow-sm"
        >
          <h3 className="mb-3 text-xl font-heading">{project.title}</h3>
          {project.role && (
            <p className="mb-3 text-sm font-heading text-foreground/70">
              {project.role}
            </p>
          )}
          <p className="mb-5 text-sm leading-relaxed text-foreground/80">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.hasDetails && (
              <a
                href={`/projects/${project.slug}/`}
                className="inline-flex items-center gap-2 rounded-base border border-black bg-black px-3 py-1.5 text-sm font-heading text-white shadow-sm transition-colors hover:bg-zinc-800 dark:border-zinc-400 dark:bg-zinc-300 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Details
                <Arrow />
              </a>
            )}
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("/") ? undefined : "_blank"}
                rel={link.href.startsWith("/") ? undefined : "noreferrer"}
                className="inline-flex items-center gap-2 rounded-base border border-border/30 bg-main px-3 py-1.5 text-sm font-heading text-main-foreground shadow-sm transition-opacity hover:opacity-80"
              >
                {link.label}
                <Arrow />
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function Panel({
  children,
  main = false,
  className = "",
}: {
  children: ReactNode;
  main?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`${main ? "bg-main text-main-foreground" : "bg-secondary-background"} mb-8 rounded-base border border-border/30 p-6 shadow-sm md:p-8 ${className}`}
    >
      {children}
    </section>
  );
}
