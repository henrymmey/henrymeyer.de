import type { Metadata } from "next";
import LinksThemeLock from "@/components/links-theme-lock";

export const metadata: Metadata = {
  title: "Links",
  description:
    "Find Henry Meyer on GitHub, Codeberg, Discord, Modrinth and other platforms.",
  alternates: { canonical: "/links/" },
};

const LINKS = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/henrymmey",
    badge: "github.png",
  },
  {
    id: "gitlab",
    label: "GitLab",
    href: "https://gitlab.com/henrymmey",
    badge: "gitlab-color.png",
  },
  {
    id: "codeberg",
    label: "Codeberg",
    href: "https://codeberg.org/henrymmey",
    badge: "codeberg-color.png",
  },
  {
    id: "crowdin",
    label: "Crowdin",
    href: "https://crowdin.com/profile/henrymmey",
    badge: "crowdin.png",
  },
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.com/users/1008346032230387752",
    badge: "discord-color.png",
  },
  {
    id: "modrinth",
    label: "Modrinth",
    href: "https://modrinth.com/user/Fg5L4UzB",
    badge: "modrinth-color.png",
  },
  {
    id: "curseforge",
    label: "CurseForge",
    href: "https://www.curseforge.com/members/henrymmey",
    badge: "curseforge.svg",
  },
  {
    id: "website",
    label: "Website",
    href: "https://henrymeyer.de",
    badge: "icons8-globe.png",
  },
  {
    id: "projects",
    label: "Projects",
    href: "https://henrymeyer.de/projects",
    badge: "icons8-globe.png",
  },
  {
    id: "contact",
    label: "Contact (Mail)",
    href: "mailto:hello@henrymeyer.de",
    badge: "icons8-email.png",
  },
  {
    id: "hm-gaming",
    label: "HMLabs Gaming",
    href: "https://gaming.hmlabs.eu",
    badge: "hm.png",
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707]">
      <LinksThemeLock />
      <main className="w-full max-w-3xl px-6">
        <div className="flex flex-col items-center text-center py-16 sm:py-24">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white">
              Hi, I&apos;m Henry.
            </h1>
            <p className="text-zinc-400 mt-1">
              Software Developer &amp; Hardware Enthusiast
            </p>
          </div>
          <div className="mt-10 w-full flex justify-center">
            <div className="w-full max-w-125">
              <div className="flex flex-col gap-3">
                {LINKS.map(({ id, label, href, badge }) => (
                  <a
                    key={id}
                    href={href}
                    target={href.startsWith("/") ? undefined : "_blank"}
                    rel={
                      href.startsWith("/") ? undefined : "noopener noreferrer"
                    }
                    className="group flex items-center justify-between w-full px-4 py-4 bg-zinc-900/60 border border-zinc-800 rounded-lg transition-colors hover:border-emerald-400/60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 overflow-hidden">
                        <img
                          src={`/badges/${badge}`}
                          alt={`${label} badge`}
                          width="28"
                          height="28"
                        />
                      </div>
                      <span className="text-white text-sm sm:text-base">
                        {label}
                      </span>
                    </div>
                    <div className="text-zinc-400 group-hover:text-emerald-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-4 h-4"
                        aria-hidden="true"
                      >
                        <path
                          d="M14 3h7v7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 14L21 3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 3v7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <footer className="mt-12 flex flex-col items-center gap-4 text-xs text-zinc-500 sm:text-sm">
            <div className="flex items-center gap-4">
              <a
                href="/legal/imprint/"
                className="transition-colors hover:text-zinc-300"
              >
                Imprint
              </a>
              <span aria-hidden="true" className="text-zinc-700">
                •
              </span>
              <a
                href="/legal/privacy/"
                className="transition-colors hover:text-zinc-300"
              >
                Privacy Policy
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
