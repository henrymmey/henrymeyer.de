"use client";

import { useEffect, useState } from "react";
import ThemeSwitcher from "@/components/theme-switcher";

const socials = [
  ["github", "GitHub", "https://github.com/henrymmey"],
  ["codeberg", "Codeberg", "https://codeberg.org/henrymmey"],
  ["modrinth", "Modrinth", "https://modrinth.com/user/HenryMMey"],
];

export default function SiteHeader() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [neoBrutalist, setNeoBrutalist] = useState(false);
  const [oneDarkPro, setOneDarkPro] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => {
      setDark(root.classList.contains("dark"));
      setNeoBrutalist(root.classList.contains("neo-brutalist"));
      setOneDarkPro(root.classList.contains("one-dark-pro"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 60 && y > lastY);
      if (Math.abs(y - lastY) > 48) setOpen(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${compact ? "px-0 pt-0" : "px-4 pt-4 md:px-8 md:pt-6"}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header
          className={`relative flex items-center justify-between bg-secondary-background/95 backdrop-blur transition-all duration-300 supports-backdrop-filter:bg-secondary-background/85 ${compact ? "rounded-none border-b border-border/30 p-2 shadow-sm md:px-6" : "rounded-base border border-border/30 p-4 shadow-sm"}`}
        >
          <a href="/" className="inline-flex items-center gap-3">
            <img
              src="/logo.png"
              alt="HenryMM Logo"
              className={`rounded-base border border-border/30 bg-background p-1 shadow-sm transition-all duration-300 ${compact ? "size-8" : "size-10"}`}
            />
            <span
              className={`font-semibold transition-all duration-300 ${compact ? "text-lg" : "text-xl"}`}
            >
              HenryMM
            </span>
          </a>
          <nav
            aria-label="Primary"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 whitespace-nowrap md:flex"
          >
            <a
              className="text-foreground/80 hover:text-foreground"
              href="/projects/"
            >
              Projects
            </a>
            <a
              className="text-foreground/80 hover:text-foreground"
              href="https://hmlabs.eu"
              target="_blank"
              rel="noreferrer"
            >
              HMLabs
            </a>
            <a
              className="text-foreground/80 hover:text-foreground"
              href="/links/"
            >
              Links
            </a>
            <a
              className="text-foreground/80 hover:text-foreground"
              href="/contact/"
            >
              Contact
            </a>
          </nav>
          <div className="hidden gap-2 md:flex">
            <ThemeSwitcher variant="compact" compactHeader={compact} />
            {socials.map(([icon, label, href]) => (
              <a
                key={icon}
                className={`header-social-button inline-flex items-center justify-center rounded-base border border-border/30 bg-secondary-background shadow-sm hover:bg-main ${compact ? "is-compact" : ""}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
              >
                <img
                  src={`/badges/${icon}${(dark && !oneDarkPro) || neoBrutalist ? "" : "-dark"}.png`}
                  alt=""
                  className="header-social-icon"
                />
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-base border border-border/30 bg-secondary-background md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </header>
        {open && (
          <div
            id="mobile-navigation"
            className="mt-2 space-y-4 rounded-base border border-border/30 bg-secondary-background/95 p-4 shadow-sm backdrop-blur md:hidden"
          >
            <nav aria-label="Mobile primary" className="grid gap-1">
              {[
                ["Projects", "/projects/"],
                ["HMLabs", "https://hmlabs.eu"],
                ["Links", "/links/"],
                ["Contact", "/contact/"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="mobile-header-link rounded-base px-3 py-2 text-foreground/80"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex gap-2 border-t border-border/30 pt-4">
              <ThemeSwitcher variant="compact" />
              {socials.map(([icon, label, href]) => (
                <a
                  key={icon}
                  className="header-social-button mobile-header-social-button inline-flex items-center justify-center rounded-base border border-border/30 bg-secondary-background"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                >
                  <img
                    src={`/badges/${icon}${(dark && !oneDarkPro) || neoBrutalist ? "" : "-dark"}.png`}
                    alt=""
                    className="size-5"
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
