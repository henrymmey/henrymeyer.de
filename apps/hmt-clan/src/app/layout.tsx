import type { Metadata, Viewport } from "next";
import RootChrome from "@/components/root-chrome";
import { ConsentProvider } from "@/components/consent-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import JsonLd from "@/components/json-ld";
import {
  SITE_DESCRIPTION,
  websiteSchema,
  organizationSchema,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixel = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://hmtclan.de";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HMT Clan",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: "HMT Clan",
  creator: "Henry Meyer",
  category: "gaming",
  keywords: [
    "HMT Clan",
    "Minecraft Clan",
    "Minecraft Community",
    "TheScape",
    "TheScape Server",
    "CraftAttack",
    "Minecraft Modpack",
    "HMT Pack",
    "Survival Minecraft",
    "Minecraft Server",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "HMT Clan",
    url: baseUrl,
    title: "HMT Clan",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "HMT Clan",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pixel.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <ConsentProvider>
          <RootChrome>{children}</RootChrome>

          <Analytics />
          <SpeedInsights />
        </ConsentProvider>
      </body>
    </html>
  );
}