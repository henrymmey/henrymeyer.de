import Link from "next/link";
import ThemeModeSelect from "@/components/theme-mode-select";

export default function SiteFooter() {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;
  const commitUrl = commitSha
    ? `https://github.com/henrymmey/henrymeyer.de/commit/${commitSha}`
    : "https://github.com/henrymmey/henrymeyer.de/commits/main";

  return (
    <footer className="mt-8 border-t border-border/30 bg-secondary-background ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="underline underline-offset-2" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="underline underline-offset-2" href="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="underline underline-offset-2" href="/projects">
                  Projects
                </Link>
              </li>
              <li>
                <a
                  className="underline underline-offset-2"
                  href="https://gaming.henrymeyer.de"
                >
                  HM Gaming
                </a>
              </li>
              <li>
                <Link className="underline underline-offset-2" href="/links">
                  Links
                </Link>
              </li>
              <li>
                <Link className="underline underline-offset-2" href="/tor">
                  Tor
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="underline underline-offset-2"
                  href="/legal/imprint"
                >
                  Imprint
                </Link>
              </li>
              <li>
                <Link
                  className="underline underline-offset-2"
                  href="/legal/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="underline underline-offset-2"
                  href="/code-of-conduct"
                >
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Appearance</h3>
            <div className="mt-1">
              <ThemeModeSelect />
            </div>
          </div>

          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="underline underline-offset-2"
                  href="https://github.com/henrymmey"
                  target="_blank"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2"
                  href="https://codeberg.org/henrymmey"
                  target="_blank"
                >
                  Codeberg
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2"
                  href="https://instagram.com/henrymmey"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2"
                  href="https://modrinth.com/user/HenryMMey"
                  target="_blank"
                >
                  Modrinth
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-base border border-border/30 bg-main px-4 py-3 text-sm text-main-foreground">
          <div>© 2026 Henry Meyer. Code licensed under GPL-3.0.</div>
          <div className="mt-1 text-xs text-main-foreground/70">
            Running on{" "}
            <a
              className="underline underline-offset-2"
              href={commitUrl}
              target="_blank"
              rel="noreferrer"
            >
              {commitSha ? commitSha.slice(0, 7) : "main"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
