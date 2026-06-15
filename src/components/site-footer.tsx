import Link from "next/link";
import { headers } from "next/headers";
import ThemeModeSelect from "@/components/theme-mode-select";

export default async function SiteFooter() {
  const host = (await headers()).get("host")?.toLowerCase() ?? "";
  const isSubsiteDomain =
    host === "jumpstone.is-cool.dev" || host.endsWith(".vercel.app");
  const rootDomain = process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de";
  const toMainDomain = (path: string) =>
    isSubsiteDomain ? `${rootDomain}${path}` : path;

  return (
    <footer className="mt-8 border-t border-border/30 bg-secondary-background ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("/")}
                  >
                    Home
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("/")}
                  >
                    Home
                  </Link>
                )}
              </li>
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("/contact")}
                  >
                    Contact
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("/contact")}
                  >
                    Contact
                  </Link>
                )}
              </li>
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("/projects")}
                  >
                    Projects
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("/projects")}
                  >
                    Projects
                  </Link>
                )}
              </li>
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("/links")}
                  >
                    Links
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("/links")}
                  >
                    Links
                  </Link>
                )}
              </li>
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("/tor")}
                  >
                    Tor
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("/tor")}
                  >
                    Tor
                  </Link>
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-base border border-border/30 bg-background p-4">
            <h3 className="mb-3 text-sm font-heading">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("https://hmlabs.eu/legal/imprint")}
                  >
                    Imprint
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("https://hmlabs.eu/legal/imprint")}
                  >
                    Imprint
                  </Link>
                )}
              </li>
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("https://hmlabs.eu/legal/privacy")}
                  >
                    Privacy Policy
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("https://hmlabs.eu/legal/privacy")}
                  >
                    Privacy Policy
                  </Link>
                )}
              </li>
              <li>
                {isSubsiteDomain ? (
                  <a
                    className="underline underline-offset-2"
                    href={toMainDomain("https://hmlabs.eu/code-of-conduct")}
                  >
                    Code of Conduct
                  </a>
                ) : (
                  <Link
                    className="underline underline-offset-2"
                    href={toMainDomain("https://hmlabs.eu/code-of-conduct")}
                  >
                    Code of Conduct
                  </Link>
                )}
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
              <li>
                <a
                  className="underline underline-offset-2"
                  href="https://discord.gg/YWc9qb8TRP"
                  target="_blank"
                >
                  Discord (Server)
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-base border border-border/30 bg-background p-6 flex items-center justify-center">
            <a href="https://www.netlify.com">
              <img src="https://www.netlify.com/assets/badges/netlify-badge-light.svg" alt="Deploys by Netlify" className="h-16" />
            </a>
          </div>
        </div>

        <div className="mt-4 rounded-base border border-border/30 bg-main px-4 py-3 text-sm text-main-foreground">
          © 2026 Henry Meyer. Code licensed under GPL-3.0.
        </div>
      </div>
    </footer>
  );
}
