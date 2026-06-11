import type { Metadata } from "next";
import { ClarityProvider } from "@/components/clarity-provider";
import SiteChrome from "@/components/site-chrome";
import { ThemeModeProvider } from "@/components/theme-mode-provider";
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

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HenryMM",
    template: "%s | HenryMM",
  },
  description:
    "My personal portfolio, focused on what I build, what I can do, and the projects, tools, and technologies I work with.",
  keywords: [
    "personal portfolio",
    "developer",
    "software developer",
    "portfolio",
    "projects",
    "open source",
    "web development",
    "gaming",
    "hardware",
    "JumpStone",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Henry aka JumpStone",
    title: "Henry aka JumpStone | Personal Portfolio & Projects",
    description:
      "A personal portfolio by Henry aka JumpStone about what I build, what I can do, and the technologies behind my projects.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Henry aka JumpStone personal portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Henry aka JumpStone | Personal Portfolio & Projects",
    description:
      "A personal portfolio by Henry aka JumpStone about what I build, what I can do, and the technologies behind my projects.",
    images: [`${baseUrl}/og-image.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
  },
};

const themeInitScript = `(() => {
  const STORAGE_KEY = "theme-mode";
  const root = document.documentElement;

  const savedMode = window.localStorage.getItem(STORAGE_KEY);
  const mode =
    savedMode === "light" || savedMode === "dark" || savedMode === "auto"
      ? savedMode
      : "auto";

  const effectiveMode =
    mode === "auto"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;

  root.classList.toggle("dark", effectiveMode === "dark");
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Henry aka JumpStone",
    url: baseUrl,
    description:
      "Personal portfolio by Henry aka JumpStone showing projects, skills, and the technologies behind my work",
    sameAs: [
      "https://github.com/jumpstone-gaming",
      "https://github.com/akku-craft",
      "https://modrinth.com/organization/jumpstone-gaming",
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head />
      <body className="min-h-full flex flex-col">
        <ClarityProvider />
        <ThemeModeProvider>
          <SiteChrome />

          {children}
        </ThemeModeProvider>
      </body>
    </html>
  );
}
