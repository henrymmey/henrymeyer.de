import SiteFooter from "@/components/site-footer";
import GitHubStats from "@/components/github-stats";
import { Arrow, ProjectCards } from "@/components/ui";
import { projects, sortProjectsByPriority } from "@/lib/projects";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-5xl">
          Hi, I&apos;m <span className="text-foreground">Henry</span>.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed">
          Young self-taught software developer &amp; hardware enthusiast from
          Germany. Turning complex problems into efficient, real-world
          solutions.
        </p>
        <GitHubStats username="henrymmey" />
      </section>
      <section
        id="about"
        className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm"
      >
        <div className="mb-5 flex items-end justify-between border-b border-border/30 pb-3">
          <h2 className="text-2xl font-heading md:text-3xl">About</h2>
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-foreground/70">
            02
          </span>
        </div>
        <p className="text-sm leading-relaxed md:text-base">
          I’m a self-taught developer and hardware hobbyist from Germany who
          enjoys projects that fall somewhere between code and circuit
          boards—such as “Akku-Craft,” a modular power bank platform that I’m
          developing from scratch, or the Minecraft modding tools I distribute
          through HM Gaming. I learn best by building things I really want and
          then figuring out the rest as I go.
        </p>
      </section>
      <section
        id="codingtime"
        className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm"
      >
        <div className="mb-5 flex items-end justify-between border-b border-border/30 pb-3">
          <h2 className="text-2xl font-heading md:text-3xl">Stats</h2>
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-foreground/70">
            03
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-base border border-border/30 bg-background p-4">
            <p className="mb-3 font-heading">Hackatime Coding Stats</p>
            <img
              loading="lazy"
              decoding="async"
              src="https://github-readme-stats.hackclub.dev/api/wakatime?username=36150&api_domain=hackatime.hackclub.com&theme=darcula&custom_title=Hackatime+Stats&layout=compact&cache_seconds=3600&langs_count=8"
              alt="Hackatime coding language stats"
            />
          </div>
          <div className="rounded-base border border-border/30 bg-background p-4">
            <p className="mb-3 font-heading">GitHub contribution streak</p>
            <img
              loading="lazy"
              decoding="async"
              src="https://github-readme-stats-fast.vercel.app/api/streak?username=henrymmey&theme=github_dark"
              alt="GitHub contribution streak stats"
            />
          </div>
        </div>
      </section>
      <section
        id="skills"
        className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm"
      >
        <div className="mb-5 flex items-end justify-between border-b border-border/30 pb-3">
          <h2 className="text-2xl font-heading md:text-3xl">Tools</h2>
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-foreground/70">
            04
          </span>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-bold">Currently learning</h3>
            <img
              loading="lazy"
              decoding="async"
              src="https://skillicons.dev/icons?i=js,ts,githubactions"
              alt="JavaScript, TypeScript, GitHub Actions"
            />
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Tools</h3>
            <img
              loading="lazy"
              decoding="async"
              src="https://skillicons.dev/icons?i=git,github,githubactions,cloudflare,docker,arduino,bash,powershell&perline=10"
              alt="Git, GitHub, GitHub Actions, Cloudflare, Docker, Arduino, Bash, PowerShell"
            />
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Programming Languages</h3>
            <img
              loading="lazy"
              decoding="async"
              src="https://skillicons.dev/icons?i=html,js,ts"
              alt="HTML, JavaScript, TypeScript"
            />
          </div>
        </div>
      </section>
      <section
        id="projects"
        className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm"
      >
        <div className="mb-5 flex items-end justify-between border-b border-border/30 pb-3">
          <h2 className="text-2xl font-heading md:text-3xl">Projects</h2>
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-foreground/70">
            05
          </span>
        </div>
        <ProjectCards items={sortProjectsByPriority(projects).slice(0, 4)} />
        <div className="mt-6">
          <a
            href="/projects/"
            className="inline-flex items-center gap-2.5 rounded-base border border-border/30 bg-main px-5 py-2.5 text-base font-heading text-main-foreground shadow-sm hover:opacity-80"
          >
            All projects <Arrow />
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
