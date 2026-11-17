"use client";

import { useEffect, useRef, useState } from "react";

const themeOptions = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

function ThemeIcon({ mode, className = "size-4" }: { mode: string; className?: string }) {
  if (mode === "light") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" strokeLinecap="round" /></svg>;
  }
  if (mode === "dark") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="M20.2 15.5A8.5 8.5 0 0 1 8.5 3.8 8.6 8.6 0 1 0 20.2 15.5Z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" strokeLinecap="round" /></svg>;
}

export default function SiteFooter() {
  const [theme, setTheme] = useState("auto");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const themeTriggerRef = useRef<HTMLButtonElement>(null);
  const themeOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved === "light" || saved === "dark" || saved === "auto")
      setTheme(saved);
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      if (theme === "auto")
        document.documentElement.classList.toggle("dark", media.matches);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);
  useEffect(() => {
    if (!themeMenuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!themeMenuRef.current?.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setThemeMenuOpen(false);
        themeTriggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    themeOptionRefs.current[themeOptions.findIndex((option) => option.value === theme)]?.focus();
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [theme, themeMenuOpen]);
  function updateTheme(value: string) {
    setTheme(value);
    localStorage.setItem("theme-mode", value);
    const dark =
      value === "dark" ||
      (value === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  }
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
            <label className="mb-2 block text-xs font-heading" htmlFor="theme">
              Theme
            </label>
            <div className="relative w-full max-w-48" ref={themeMenuRef}>
              <button
                ref={themeTriggerRef}
                id="theme"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={themeMenuOpen}
                aria-controls="theme-options"
                onClick={() => setThemeMenuOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setThemeMenuOpen(true);
                  }
                }}
                className="group flex w-full items-center justify-between rounded-lg border border-border/50 bg-background px-3 py-2.5 text-sm shadow-sm transition-all hover:border-foreground/30 hover:bg-secondary-background focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span className="flex items-center gap-2.5">
                  <ThemeIcon mode={theme} className="size-4 text-foreground/70" />
                  <span className="font-heading">{themeOptions.find((option) => option.value === theme)?.label ?? "Auto"}</span>
                </span>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className={`size-4 text-foreground/55 transition-transform ${themeMenuOpen ? "rotate-180" : ""}`} aria-hidden="true"><path d="m5.5 7.5 4.5 4.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {themeMenuOpen && (
                <div id="theme-options" role="listbox" aria-labelledby="theme" className="theme-menu-enter absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl border border-border/60 bg-background/95 p-1.5 shadow-xl backdrop-blur-xl">
                  {themeOptions.map((option, index) => {
                    const selected = theme === option.value;
                    return (
                      <button
                        key={option.value}
                        ref={(element) => { themeOptionRefs.current[index] = element; }}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => {
                          updateTheme(option.value);
                          setThemeMenuOpen(false);
                          themeTriggerRef.current?.focus();
                        }}
                        onKeyDown={(event) => {
                          let nextIndex: number | null = null;
                          if (event.key === "ArrowDown") nextIndex = (index + 1) % themeOptions.length;
                          if (event.key === "ArrowUp") nextIndex = (index - 1 + themeOptions.length) % themeOptions.length;
                          if (event.key === "Home") nextIndex = 0;
                          if (event.key === "End") nextIndex = themeOptions.length - 1;
                          if (nextIndex !== null) {
                            event.preventDefault();
                            themeOptionRefs.current[nextIndex]?.focus();
                          }
                          if (event.key === "Tab") setThemeMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${selected ? "bg-main text-main-foreground" : "text-foreground hover:bg-secondary-background"}`}
                      >
                        <span className={`flex size-9 shrink-0 items-center justify-center rounded-md border ${selected ? "border-border/30 bg-background/70" : "border-border/30 bg-background"}`}>
                          <ThemeIcon mode={option.value} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-heading">{option.label}</span>
                        </span>
                        {selected && <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0" aria-hidden="true"><path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </button>
                    );
                  })}
                </div>
              )}
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
