"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";

export default function SiteChrome() {
  const pathname = usePathname();

  if (
    pathname === "/links" ||
    pathname.startsWith("/links/") ||
    pathname === "/meyerwolke" ||
    pathname.startsWith("/meyerwolke/")
  ) {
    return null;
  }

  return (
    <>
      <SiteHeader />

      <div className="h-28 md:h-32" aria-hidden="true" />
    </>
  );
}
