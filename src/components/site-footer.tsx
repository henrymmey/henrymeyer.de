"use client";

import ThemeSwitcher from "@/components/theme-switcher";

export default function SiteFooter() {
  const sha = process.env.NEXT_PUBLIC_COMMIT_SHA;
  const commitUrl = sha
    ? `https://github.com/henrymmey/henrymeyer.de/commit/${sha}`
    : "https://github.com/henrymmey/henrymeyer.de/commits/main";
  return (
    <footer className="mt-8 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] border-t border-border/30 bg-secondary-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="underline underline-offset-2" href="/">
                  Home
                </a>
              </li>
              <li>
                <a className="underline underline-offset-2" href="/contact/">
                  Contact
                </a>
              </li>
              <li>
                <a className="underline underline-offset-2" href="/projects/">
                  Projects
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2"
                  href="https://hmlabs.eu"
                >
                  HMLabs
                </a>
              </li>
              <li>
                <a className="underline underline-offset-2" href="/links/">
                  Links
                </a>
              </li>
              <li>
                <a className="underline underline-offset-2" href="/tor/">
                  Tor
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="underline underline-offset-2"
                  href="/legal/imprint/"
                >
                  Imprint
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2"
                  href="/legal/privacy/"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2"
                  href="/code-of-conduct/"
                >
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Appearance</h3>
            <label className="mb-2 block text-xs font-heading">
              Theme
            </label>
            <div className="w-full max-w-48">
              <ThemeSwitcher />
            </div>
          </div>
          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["GitHub", "https://github.com/henrymmey"],
                ["Codeberg", "https://codeberg.org/henrymmey"],
                ["Modrinth", "https://modrinth.com/user/HenryMMey"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    className="underline underline-offset-2"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
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
              {sha ? sha.slice(0, 7) : "main"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
