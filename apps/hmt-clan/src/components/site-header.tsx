"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { href: string; label: string; external?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/crew", label: "Crew" },
  { href: "/calendar", label: "Kalender" },
  { href: "/pack", label: "Modpack" },
];

const DISCORD_INVITE = "https://discord.gg/8aWmBuYURK";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteHeader({
  logoSrc = "/logo.png",
}: {
  logoSrc?: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-black/40 transition-all duration-300",
        scrolled
          ? "bg-[#0b0e0b]/90 shadow-block backdrop-blur-md"
          : "bg-[#0b0e0b]/60 backdrop-blur-sm",
      )}
    >
      <div aria-hidden="true" className="h-[3px] w-full bg-grass" />

      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 md:px-8 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 justify-self-start"
        >
          <span className="rounded-block border border-black/50 bg-surface-3 p-1 shadow-block transition-transform duration-200 group-hover:-translate-y-px">
            <Image
              src={logoSrc}
              alt="HMT Clan Logo"
              width={32}
              height={32}
              className="size-8"
            />
          </span>
          <span className="font-pixel text-sm uppercase tracking-[0.12em] text-foreground md:text-base">
            HMT <span className="text-grass">Clan</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 lg:flex lg:gap-7"
        >
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <Link
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "font-pixel text-sm uppercase tracking-[0.12em] transition-colors duration-150 hover:text-foreground",
                  "text-muted",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive(pathname, item.href) ? "page" : undefined
                }
                className={cn(
                  "font-pixel text-sm uppercase tracking-[0.12em] transition-colors duration-150 hover:text-foreground",
                  isActive(pathname, item.href) ? "text-grass" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center justify-self-end gap-2 lg:flex">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            aria-label="HMT Clan Discord-Server"
            title="Discord"
            className="inline-flex size-9 items-center justify-center rounded-block border border-black/50 bg-surface-3 shadow-block transition-all duration-150 hover:-translate-y-px hover:bg-surface-hover active:translate-y-px active:shadow-none"
          >
            <Image
              src="/badges/discord.png"
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className="size-5 object-contain"
            />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-block border border-black/50 bg-surface-3 text-foreground shadow-block transition-colors hover:bg-surface-hover lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          "overflow-hidden border-t border-black/40 bg-[#0e120e]/95 backdrop-blur-md transition-[max-height,opacity] duration-200 lg:hidden",
          isMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Mobile primary" className="grid px-4 py-3">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <Link
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-block px-3 py-2.5 font-pixel text-sm uppercase tracking-[0.12em] text-foreground/80 transition-colors hover:bg-surface-3 hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive(pathname, item.href) ? "page" : undefined
                }
                className={cn(
                  "rounded-block px-3 py-2.5 font-pixel text-sm uppercase tracking-[0.12em] transition-colors hover:bg-surface-3 hover:text-foreground",
                  isActive(pathname, item.href)
                    ? "bg-surface-3 text-grass"
                    : "text-foreground/80",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2 border-t border-black/40 px-4 py-3">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            aria-label="HMT Clan Discord-Server"
            className="inline-flex size-10 items-center justify-center rounded-block border border-black/50 bg-surface-3 shadow-block transition-colors hover:bg-surface-hover"
          >
            <Image
              src="/badges/discord.png"
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className="size-5 object-contain"
            />
          </a>
          <span className="ml-auto hidden text-[10px] font-pixel uppercase tracking-widest text-muted sm:block">
            hmtclan.de
          </span>
        </div>
      </div>
    </header>
  );
}
