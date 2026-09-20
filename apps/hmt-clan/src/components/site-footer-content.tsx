"use client";

import Link from "next/link";
import Image from "next/image";
import { useConsent } from "@/components/consent-provider";
import MinecraftButton from "@/components/minecraft/minecraft-button";

const fullBleed = "ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/crew", label: "Crew" },
  { href: "/calendar", label: "Kalender" },
  {
    href: "https://gaming.henrymeyer.de/projects/modpacks/hmt-pack/",
    label: "Modpack",
    external: true,
  },
];

export default function SiteFooterContent({
  commitSha,
}: {
  commitSha?: string;
}) {
  const { openDialog } = useConsent();

  const commitUrl = commitSha
    ? `https://github.com/henrymmey/henrymeyer.de/commit/${commitSha}`
    : "https://github.com/henrymmey/henrymeyer.de/commits/main";

  return (
    <footer className="relative" aria-label="Footer">
      <div aria-hidden="true">
        <div
          className={`${fullBleed} texture texture-grass-top tex-32 h-[12px] w-[100vw]`}
        />
        <div className={`${fullBleed} relative h-[12px] w-[100vw]`}>
          <div className="texture texture-grass-side tex-32 absolute inset-0" />
        </div>
        <div
          className={`${fullBleed} texture texture-dirt tex-32 relative h-6 w-[100vw] border-t border-black/40`}
        >
          <div className="absolute inset-0 bg-black/15" />
        </div>
      </div>

      <div
        className={`${fullBleed} relative border-t border-black/50 bg-[#171207]`}
      >
        <div
          aria-hidden="true"
          className="texture texture-dirt tex-32 absolute inset-0 opacity-[0.1]"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="HMT Clan Logo"
                  width={44}
                  height={44}
                  className="size-11 rounded-block border border-black/50 bg-surface-3 p-1 shadow-block"
                />
                <span className="font-pixel text-lg uppercase tracking-[0.1em] text-foreground">
                  HMT <span className="text-grass">Clan</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Eine Gruppe von Freunden, die gemeinsam auf TheScape Minecraft
                spielt – bauen, erkunden und Abenteuer erleben.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <MinecraftButton
                  href="https://discord.gg/8aWmBuYURK"
                  external
                  variant="stone"
                  size="sm"
                >
                  Discord
                </MinecraftButton>
                <MinecraftButton
                  href="https://id.hmt-clan.henrymeyer.de"
                  external
                  variant="stone"
                  size="sm"
                >
                  ID Portal
                </MinecraftButton>
              </div>
            </div>

            <nav aria-label="Footer Navigation">
              <p className="mb-4 font-pixel text-[10px] uppercase tracking-[0.2em] text-grass">
                Entdecken
              </p>
              <ul className="space-y-2.5 text-sm">
                {navLinks.map((link) =>
                  link.external ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <nav aria-label="Rechtliches">
              <p className="mb-4 font-pixel text-[10px] uppercase tracking-[0.2em] text-grass">
                Rechtliches
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://henrymeyer.de/legal/imprint"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Impressum
                  </a>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openDialog}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Cookie-Einstellungen
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-12 border-t border-white/5 pt-6">
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} HMT Clan. Code lizenziert unter{" "}
              <a
                href="https://github.com/henrymmey"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 underline decoration-emerald/40 underline-offset-2 hover:text-foreground"
              >
                GPL-3.0
              </a>
              . Entwickelt mit{" "}
              <Image
                src="/textures/full-heart.png"
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                className="inline-block size-3.5 align-[-2px]"
              />{" "}
              von{" "}
              <a
                href="https://henrymeyer.de/"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 underline decoration-emerald/40 underline-offset-2 hover:text-foreground"
              >
                Henry Meyer
              </a>
              .
            </p>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted/70">
              NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED
              WITH MOJANG OR MICROSOFT.
              <br />
              NICHT MIT THESCAPE VERBUNDEN.
            </p>
            <p className="mt-3 text-xs text-muted/70">
              Aktuelles Deployment:{" "}
              <a
                href={commitUrl}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-emerald/40 underline-offset-2 transition-colors hover:text-foreground"
              >
                {commitSha ? commitSha.slice(0, 7) : "main"}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`${fullBleed} texture texture-dirt tex-32 h-16 w-[100vw] border-t border-black/50`}
      />
    </footer>
  );
}
