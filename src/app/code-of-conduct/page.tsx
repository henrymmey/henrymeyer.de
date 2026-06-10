import SiteFooter from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct",
  description:
    "Community guidelines for respectful and inclusive interaction across JumpStone spaces and projects.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Code of Conduct",
    description:
      "Community guidelines for respectful and inclusive interaction across JumpStone spaces.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de"}/code-of-conduct`,
  },
};

export default function CodeOfConductPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="mb-2 text-3xl font-heading md:text-4xl">
          Code of Conduct
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed md:text-base">
          Community guidelines for respectful and inclusive interaction across
          all JumpStone and JumpStone-Gaming project areas.
        </p>
      </section>

      <article className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
        <section className="mb-6 rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-heading">Our Pledge</h2>
          <p className="text-sm leading-relaxed md:text-base">
            I as the maintainer of all JumpStone and JumpStone-Gaming projects,
            am committed to providing a friendly, safe, and welcoming
            environment for all, regardless of level of experience, gender
            identity and expression, sexual orientation, disability, personal
            appearance, body size, race, ethnicity, age, religion, or
            nationality.
          </p>
        </section>

        <section className="mb-6 rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-heading">Our Standards</h2>

          <div className="mb-4 rounded-base border border-green-500/30 bg-green-100 p-4 text-green-900 shadow-sm dark:bg-green-950/30 dark:text-green-300">
            <h3 className="mb-2 text-sm font-heading">
              ✓ Examples of behavior that contributes to a positive environment
              include:
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed md:text-base">
              <li>Using welcoming and inclusive language.</li>
              <li>Being respectful of differing viewpoints and experiences.</li>
              <li>Gracefully accepting constructive criticism.</li>
              <li>Focusing on what is best for the community.</li>
              <li>Showing empathy towards other community members.</li>
            </ul>
          </div>

          <div className="rounded-base border border-red-500/30 bg-red-100 p-4 text-red-900 shadow-sm dark:bg-red-950/30 dark:text-red-300">
            <h3 className="mb-2 text-sm font-heading">
              ✗ Examples of unacceptable behavior include:
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed md:text-base">
              <li>
                The use of sexualized language or imagery and unwelcome sexual
                attention or advances.
              </li>
              <li>
                Trolling, insulting/derogatory comments, and personal or
                political attacks.
              </li>
              <li>Public or private harassment.</li>
              <li>
                Publishing others' private information, such as a physical or
                electronic address, without explicit permission.
              </li>
              <li>
                Other conduct which could reasonably be considered inappropriate
                in a professional setting.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-6 rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-heading">Scope</h2>
          <p className="text-sm leading-relaxed md:text-base">
            This Code of Conduct applies within all project spaces managed by
            JumpStone and JumpStone-Gaming, and it also applies when an
            individual is representing the project or its community in public
            spaces. Examples of representing a project or community include
            using an official project e-mail address, posting via an official
            social media account, or acting as an appointed representative at an
            online or offline event.
          </p>
        </section>

        <section className="mb-6 rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-heading">Enforcement</h2>
          <p className="mb-3 text-sm leading-relaxed md:text-base">
            Responsibilities for clarifying the standards of acceptable behavior
            and taking appropriate and fair corrective action in response to any
            instances of unacceptable behavior lie with the project maintainers.
          </p>
          <div className="rounded-base border border-border/30 bg-secondary-background p-4">
            <p className="text-sm leading-relaxed md:text-base">
              If you experience or witness unacceptable behavior, please report
              it to the maintainers via the{" "}
              <a style={{ textDecoration: "underline" }} href="/contact">
                contact page
              </a>
              .
            </p>{" "}
            <p>
              All complaints will be reviewed and investigated and will result
              in a response that is deemed necessary and appropriate to the
              circumstances. The project team is obligated to maintain
              confidentiality with regard to the reporter of an incident.
            </p>
          </div>
        </section>

        <section className="rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-heading">Attribution</h2>
          <p className="text-sm leading-relaxed md:text-base">
            This Code of Conduct is adapted from the{" "}
            <a
              href="https://www.contributor-covenant.org"
              target="_blank"
              rel="noreferrer"
              className="ml-1 font-heading underline underline-offset-2"
            >
              Contributor Covenant
            </a>
            , version 2.1, available at
            <a
              href="https://www.contributor-covenant.org/version/2/1/code_of_conduct.html"
              target="_blank"
              rel="noreferrer"
              className="ml-1 font-heading underline underline-offset-2"
            >
              https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
            </a>
            .
          </p>
        </section>

        <p className="mt-5 text-xs font-mono text-foreground/70">
          Last Updated: April 2026
        </p>
      </article>

      <SiteFooter />
    </main>
  );
}
