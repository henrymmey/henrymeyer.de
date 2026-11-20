"use client";

import { useEffect, useId, useRef, useState } from "react";

export const themeOptions = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "neo-brutalist", label: "Neo Brutalism" },
  { value: "one-dark-pro", label: "One Dark Pro" },
] as const;

export type ThemeValue = (typeof themeOptions)[number]["value"];

const THEME_CHANGE_EVENT = "theme-change";

function applyTheme(value: ThemeValue) {
  const root = document.documentElement;
  root.classList.toggle("neo-brutalist", value === "neo-brutalist");
  root.classList.toggle("one-dark-pro", value === "one-dark-pro");
  const dark =
    value === "neo-brutalist" ||
    value === "one-dark-pro" ||
    value === "dark" ||
    (value === "auto" &&
      matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}

function ThemeIcon({
  mode,
  className = "size-4",
}: {
  mode: ThemeValue;
  className?: string;
}) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" strokeLinecap="round" />
      </svg>
    );
  }
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path d="M20.2 15.5A8.5 8.5 0 0 1 8.5 3.8 8.6 8.6 0 1 0 20.2 15.5Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (mode === "neo-brutalist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" />
        <path d="M3 12h18M12 3v18" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (mode === "one-dark-pro") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <path d="M7 8h10M7 12h6M7 16h8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8m-4-4v4" strokeLinecap="round" />
    </svg>
  );
}

export default function ThemeSwitcher({
  variant = "full",
  compactHeader = false,
}: {
  variant?: "full" | "compact";
  compactHeader?: boolean;
}) {
  const [theme, setTheme] = useState<ThemeValue>("auto");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const triggerId = `theme-trigger-${id}`;
  const optionsId = `theme-options-${id}`;

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode");
    if (themeOptions.some((option) => option.value === saved)) {
      setTheme(saved as ThemeValue);
      applyTheme(saved as ThemeValue);
    } else {
      applyTheme("auto");
    }

    const syncTheme = (event: Event) => {
      const value = (event as CustomEvent<ThemeValue>).detail;
      setTheme(value);
      applyTheme(value);
    };
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
  }, []);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyTheme(theme);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    optionRefs.current[themeOptions.findIndex((option) => option.value === theme)]?.focus();
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, theme]);

  const updateTheme = (value: ThemeValue) => {
    setTheme(value);
    localStorage.setItem("theme-mode", value);
    applyTheme(value);
    window.dispatchEvent(new CustomEvent<ThemeValue>(THEME_CHANGE_EVENT, { detail: value }));
  };

  const current = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];

  return (
    <div
      className={
        variant === "compact"
          ? `header-theme-switcher mobile-theme-switcher relative shrink-0 ${compactHeader ? "is-compact" : ""}`
          : "relative"
      }
      ref={menuRef}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label={variant === "compact" ? `Theme: ${current.label}` : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={optionsId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={
          variant === "compact"
            ? `header-theme-button mobile-theme-button inline-flex shrink-0 items-center justify-center rounded-base border border-border/30 bg-secondary-background hover:bg-main ${compactHeader ? "is-compact" : ""}`
            : "group flex w-full items-center justify-between rounded-lg border border-border/50 bg-background px-3 py-2.5 text-sm shadow-sm transition-all hover:border-foreground/30 hover:bg-secondary-background"
        }
        title={variant === "compact" ? `Theme: ${current.label}` : undefined}
      >
        {variant === "compact" ? (
          <ThemeIcon
            mode={theme}
            className="theme-switcher-trigger-icon header-theme-icon"
          />
        ) : (
          <>
            <span className="flex items-center gap-2.5">
              <ThemeIcon mode={theme} className="theme-switcher-trigger-icon size-4 text-foreground/70" />
              <span className="font-heading">{current.label}</span>
            </span>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className={`size-4 text-foreground/55 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
              <path d="m5.5 7.5 4.5 4.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
      {open && (
        <div
          id={optionsId}
          role="listbox"
          aria-labelledby={triggerId}
          className={`theme-menu-enter z-[60] rounded-xl border border-border/60 bg-background/95 p-1.5 shadow-xl backdrop-blur-xl ${variant === "compact" ? "fixed bottom-4 left-4 right-4 max-h-[70vh] overflow-y-auto md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-64" : "absolute bottom-full left-0 mb-2 w-64"}`}
        >
          {themeOptions.map((option, index) => {
            const selected = theme === option.value;
            return (
              <button
                key={option.value}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  updateTheme(option.value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                onKeyDown={(event) => {
                  let nextIndex: number | null = null;
                  if (event.key === "ArrowDown") nextIndex = (index + 1) % themeOptions.length;
                  if (event.key === "ArrowUp") nextIndex = (index - 1 + themeOptions.length) % themeOptions.length;
                  if (event.key === "Home") nextIndex = 0;
                  if (event.key === "End") nextIndex = themeOptions.length - 1;
                  if (nextIndex !== null) {
                    event.preventDefault();
                    optionRefs.current[nextIndex]?.focus();
                  }
                  if (event.key === "Tab") setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${selected ? "bg-main text-main-foreground" : "text-foreground hover:bg-secondary-background"}`}
              >
                <span className={`theme-switcher-option-icon flex size-9 shrink-0 items-center justify-center rounded-md border ${selected ? "border-border/30 bg-background/70" : "border-border/30 bg-background"}`}>
                  <ThemeIcon mode={option.value} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-heading">{option.label}</span>
                </span>
                {selected && (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0" aria-hidden="true">
                    <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
