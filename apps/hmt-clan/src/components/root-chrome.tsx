"use client";

import { usePathname } from "next/navigation";
import SiteChrome from "@/components/site-chrome";
import CookieBanner from "@/components/cookie-banner";
import ConsentDialog from "@/components/consent-dialog";

/**
 * Rendert die oeffentliche Chrome (Header, Cookie-Banner) nur ausserhalb
 * des Admin-Bereichs. /admin* bekommt sein eigenes Layout.
 */
export default function RootChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteChrome />
      {children}
      <CookieBanner />
      <ConsentDialog />
    </>
  );
}