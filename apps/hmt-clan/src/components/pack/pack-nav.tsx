"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PACK_PAGES } from "@/lib/modpack-pages";

export default function PackNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="HMT Pack"
      className="rounded-block border border-black/50 bg-surface-3 p-3 shadow-card"
    >
      <span className="block px-3 pb-2 pt-1 font-pixel text-[10px] uppercase tracking-[0.2em] text-muted">
        HMT Pack
      </span>
      <ul className="space-y-1">
        {PACK_PAGES.map((page) => {
          const active =
            page.href === "/pack"
              ? pathname === "/pack"
              : pathname === page.href || pathname.startsWith(page.href + "/");
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-block border px-3 py-2 font-pixel text-xs uppercase tracking-[0.1em] transition-colors",
                  active
                    ? "border-emerald/60 bg-surface-2 text-grass shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_1px_0_rgb(0_0_0/0.4)]"
                    : "border-transparent text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 border-t border-white/5 px-3 pt-3">
        <p className="text-xs leading-relaxed text-muted">
          Zur Verfügung gestellt von unserem Partner{" "}
          <a
            href="https://gaming.henrymeyer.de/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-emerald/40 underline-offset-2 transition-colors hover:text-foreground hover:decoration-emerald"
          >
            HM Gaming
          </a>
          .
        </p>
      </div>
    </nav>
  );
}