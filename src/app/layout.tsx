import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

const baseUrl = "https://henrymeyer.de";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Henry Meyer — Software Development & Hardware Projects",
    template: "%s | Henry Meyer",
  },
  description:
    "Personal website of Henry Meyer, a self-taught software developer and hardware enthusiast from Germany. Explore software, gaming, and hardware projects.",
  keywords: [
    "Henry Meyer",
    "Henry Meyer personal portfolio",
    "Henry Meyer developer",
    "software developer portfolio",
    "software development",
    "hardware projects",
    "Minecraft mods and tools",
    "Akku-Craft",
    "HMLabs Gaming",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Henry Meyer",
    title: "Henry Meyer — Software Developer & Hardware Enthusiast",
    description:
      "Projects and work by Henry Meyer, a self-taught software developer and hardware enthusiast from Germany.",
    images: [
      { url: "/logo.png", width: 1024, height: 1024, alt: "Henry Meyer" },
    ],
  },
  twitter: {
    card: "summary",
    title: "Henry Meyer — Software Developer",
    description: "Projects and work by Henry Meyer.",
    images: ["/logo.png"],
  },
  icons: { icon: "/favicon.ico" },
};

const themeInit = `(()=>{try{if(location.pathname.startsWith('/links'))return;const saved=localStorage.getItem('theme-mode');const root=document.documentElement;const neo=saved==='neo-brutalist';const one=saved==='one-dark-pro';root.classList.toggle('neo-brutalist',neo);root.classList.toggle('one-dark-pro',one);const dark=neo||one||saved==='dark'||(saved!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);root.classList.toggle('dark',dark)}catch{}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Henry Max Meyer",
    alternateName: ["HenryMM", "JumpStone"],
    url: baseUrl,
    jobTitle: "Software Developer",
    knowsAbout: [
      "Software development",
      "Hardware engineering",
      "Minecraft modding",
      "Digital accessibility",
      "Modular electronics",
    ],
    description:
      "Self-taught software developer and hardware enthusiast from Germany.",
    sameAs: [
      "https://github.com/henrymmey",
      "https://codeberg.org/henrymmey",
      "https://modrinth.com/user/HenryMMey",
    ],
  };
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <SiteChrome />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
