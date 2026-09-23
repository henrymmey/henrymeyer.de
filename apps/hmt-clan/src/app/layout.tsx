import type { Metadata, Viewport } from "next";
import RootChrome from "@/components/root-chrome";
import { ConsentProvider } from "@/components/consent-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
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

const siteDescription =
  "HMT Clan – Eine Gruppe von Freunden, die gemeinsam auf TheScape Minecraft spielt.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HMT Clan",
    template: "%s | HMT Clan",
  },
  description: siteDescription,
  alternates: {
    canonical: baseUrl,
  },
  applicationName: "HMT Clan",
  creator: "Henry Meyer",
  keywords: [
    "HMT Clan",
    "Minecraft",
    "TheScape",
    "Minecraft Clan",
    "Minecraft Community",
    "Survival",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "HMT Clan",
    url: baseUrl,
    title: "HMT Clan",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "HMT Clan",
    description: siteDescription,
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
        <ConsentProvider>
          <RootChrome>{children}</RootChrome>

          <Analytics />
          <SpeedInsights />
        </ConsentProvider>
      </body>
    </html>
  );
}