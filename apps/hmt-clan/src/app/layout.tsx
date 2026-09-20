import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";
import { ConsentProvider } from "@/components/consent-provider";
import ConsentDialog from "@/components/consent-dialog";
import CookieBanner from "@/components/cookie-banner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://hmt-clan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HMT Clan",
    template: "%s | HMT Clan",
  },
  description: "The official HMT Clan site.",
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head />
      <body className="min-h-full flex flex-col">
        <ConsentProvider>
          <SiteChrome />

          {children}

          <CookieBanner />
          <ConsentDialog />
          <Analytics />
          <SpeedInsights />
        </ConsentProvider>
      </body>
    </html>
  );
}
