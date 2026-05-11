"use client";

import { useThemeMode } from "@/components/theme-mode-provider";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  logoSrc?: string;
  siteName?: string;
};

const socialLinks = [
  {
    href: "https://github.com/henrymmey",
    iconName: "github",
    label: "GitHub",
  },
  {
    href: "https://codeberg.org/henrymmey",
    iconName: "codeberg",
    label: "Codeberg",
  },
  {
    href: "https://instagram.com/henrymmey",
    iconName: "instagram",
    label: "Instagram",
  },
  {
    href: "https://modrinth.com/user/HenryMMey",
    iconName: "modrinth",
    label: "Modrinth",
  },
];

export default function SiteHeader({
  logoSrc = "/logo.png",
  siteName = "HenryMM",
}: SiteHeaderProps) {
  const { effectiveMode } = useThemeMode();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

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
          <a href="/" className="inline-flex items-center gap-3">
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
          </a>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 whitespace-nowrap"
          >
            <a
              href="/projects"
              className={`text-foreground/80 transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:underline ${
                isCompact ? "text-sm" : "text-base"
              }`}
            >
              Projects
            </a>
            <a
              href="/links"
              className={`text-foreground/80 transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:underline ${
                isCompact ? "text-sm" : "text-base"
              }`}
            >
              Links
            </a>
            <a
              href="/contact"
              className={`text-foreground/80 transition-all duration-300 hover:text-foreground focus-visible:outline-none focus-visible:underline ${
                isCompact ? "text-sm" : "text-base"
              }`}
            >
              Contact
            </a>
          </nav>

          <div className="flex flex-wrap gap-2">
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
                  src={`/badges/${link.iconName}${effectiveMode === "light" ? "-dark" : ""}.png`}
                  alt=""
                  aria-hidden="true"
                  className={`object-contain transition-all duration-300 ${
                    isCompact ? "size-4" : "size-5"
                  }`}
                />
              </a>
            ))}
          </div>
        </header>
      </div>
    </div>
  );
}
