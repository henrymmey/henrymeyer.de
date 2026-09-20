"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SiteHeaderProps = {
  logoSrc?: string;
  siteName?: string;
};

const socialLinks = [
  {
    href: "https://discord.gg/8aWmBuYURK",
    iconName: "discord",
    label: "Discord",
  },
];

export default function SiteHeader({
  logoSrc = "/logo.png",
  siteName = "HMT Clan",
}: SiteHeaderProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuOpenedAtScrollY = useRef<number | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      if (
        menuOpenedAtScrollY.current !== null &&
        Math.abs(currentScrollY - menuOpenedAtScrollY.current) > 48
      ) {
        menuOpenedAtScrollY.current = null;
        setIsMenuOpen(false);
      }

      if (currentScrollY <= 40) {
        setIsCompact(false);
      } else if (isScrollingDown && currentScrollY > 60) {
        setIsCompact(true);
      } else if (!isScrollingDown && lastScrollY - currentScrollY > 10) {
        setIsCompact(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isCompact ? "px-0 pt-0" : "px-4 pt-4 md:px-8 md:pt-6"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl transition-all duration-300">
        <header
          className={`relative flex items-center justify-between bg-secondary-background/95 transition-all duration-300 backdrop-blur supports-backdrop-filter:bg-secondary-background/85 ${
            isCompact
              ? "rounded-none border-b border-border/30 p-2 md:px-6 shadow-sm"
              : "rounded-base border border-border/30 p-4 shadow-sm"
          }`}
        >
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src={logoSrc}
              alt={`${siteName} Logo`}
              className={`rounded-base border border-border/30 bg-background shadow-sm transition-all duration-300 ${
                isCompact ? "size-8 p-1" : "size-10 p-1.5"
              }`}
            />
            <span
              className={`font-semibold transition-all duration-300 ${
                isCompact ? "text-lg" : "text-xl"
              }`}
            >
              {siteName}
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 whitespace-nowrap md:flex"
          >
            <Link
              href="/pack"
              target="_blank"
              className={`text-foreground/80 transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:underline ${
                isCompact ? "text-sm" : "text-base"
              }`}
            >
              Modpack
            </Link>
            <Link
              href="/events"
              className={`text-foreground/80 transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:underline ${
                isCompact ? "text-sm" : "text-base"
              }`}
            >
              Events
            </Link>
            <Link
              href="/contact"
              className={`text-foreground/80 transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:underline ${
                isCompact ? "text-sm" : "text-base"
              }`}
            >
              Kontakt
            </Link>
          </nav>

          <div className="hidden flex-wrap items-center gap-2 md:flex">
            <Link
              href="https://id.hmt-clan.henrymeyer.de"
              target="_blank"
              rel="noreferrer"
              aria-label="ID Portal"
              className={`inline-flex items-center justify-center rounded-base border border-border/30 bg-main font-heading text-main-foreground shadow-sm transition-all duration-300 hover:opacity-80 ${
                isCompact ? "size-8 text-sm" : "size-11 text-base"
              }`}
            >
              ID
            </Link>
            {socialLinks.map((link) => (
              <a
                key={link.href}
                className={`inline-flex items-center justify-center rounded-base border border-border/30 bg-secondary-background shadow-sm transition-all duration-300 hover:opacity-80 hover:bg-main ${
                  isCompact ? "size-8" : "size-11"
                }`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
              >
                <img
                  src={`/badges/${link.iconName}.png`}
                  alt=""
                  aria-hidden="true"
                  className={`object-contain transition-all duration-300 ${
                    isCompact ? "size-4" : "size-5"
                  }`}
                />
              </a>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-base border border-border/30 bg-secondary-background shadow-sm transition-colors hover:bg-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              if (isMenuOpen) {
                menuOpenedAtScrollY.current = null;
                setIsMenuOpen(false);
                return;
              }

              menuOpenedAtScrollY.current = window.scrollY;
              setIsMenuOpen(true);
            }}
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </header>

        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="mt-2 space-y-4 rounded-base border border-border/30 bg-secondary-background/95 p-4 shadow-sm backdrop-blur supports-backdrop-filter:bg-secondary-background/85 md:hidden"
          >
            <nav aria-label="Mobile primary" className="grid gap-1">
              <Link
                href="/pack"
                target="_blank"
                className="rounded-base px-3 py-2 text-foreground/80 transition-colors hover:bg-main hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Modpack
              </Link>
              <Link
                href="/events"
                className="rounded-base px-3 py-2 text-foreground/80 transition-colors hover:bg-main hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Events
              </Link>
              <Link
                href="/contact"
                className="rounded-base px-3 py-2 text-foreground/80 transition-colors hover:bg-main hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Kontakt
              </Link>
            </nav>

            <div className="flex items-center gap-2 border-t border-border/30 pt-4">
              <Link
                href="https://id.hmt-clan.henrymeyer.de"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-11 items-center justify-center rounded-base border border-border/30 bg-main font-heading text-main-foreground shadow-sm transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="ID Portal"
              >
                ID
              </Link>
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  className="inline-flex size-11 items-center justify-center rounded-base border border-border/30 bg-secondary-background shadow-sm transition-colors hover:bg-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                >
                  <img
                    src={`/badges/${link.iconName}.png`}
                    alt=""
                    aria-hidden="true"
                    className="size-5 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
