"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/site-header";

function CalendarHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center gap-3 border-b border-black/40 bg-[#0b0e0b]/80 p-3 backdrop-blur-md">
      <Link href="/" aria-label="Zur Startseite">
        <Image
          src="/logo.png"
          alt="HMT Clan Logo"
          width={32}
          height={32}
          className="size-9 rounded-block border border-black/50 bg-surface-3 p-0.5"
        />
      </Link>
      <Link
        href="/"
        className="inline-flex items-center gap-1 font-pixel text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Zurück
      </Link>
    </header>
  );
}

export default function SiteChrome() {
  const pathname = usePathname();

  if (pathname === "/calendar/full") {
    return null;
  }

  return (
    <>
      {pathname === "/calendar" ? (
        <CalendarHeader />
      ) : (
        <>
          <SiteHeader />
          <div className="h-[84px]" aria-hidden="true" />
        </>
      )}
    </>
  );
}