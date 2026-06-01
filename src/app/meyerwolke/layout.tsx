import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "MeyerWolke",
    template: "%s | MeyerWolke",
  },
  description:
    "MeyerWolke pages with a dedicated legal area and redirect entry point.",
  icons: {
    icon: "/meyerwolke.png",
  },
};

export default function MeyerWolkeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#6EA68F] text-[#ededed] flex flex-col justify-between items-center py-6 px-4 relative antialiased">
      <div className="w-full flex-grow flex flex-col items-center pt-8 sm:pt-16 pb-12">
        <div className="mb-6 flex justify-center">
          <img
            src="/meyerwolke.png"
            alt="MeyerWolke Logo"
            className="h-28 w-auto object-contain drop-shadow-md"
          />
        </div>
        {children}
      </div>

      <div className="bg-[#2D3330] text-[#ededed] text-[11px] sm:text-xs py-3 px-6 rounded-2xl flex flex-col items-center text-center gap-1.5 shadow-lg shadow-black/20">
        <span>
          <span className="font-semibold text-white">MeyerWolke</span>{" "}
          <span className="opacity-90">
            – hier fühlen sich deine Dateien wohl
          </span>
        </span>
        <span className="opacity-80">
          <Link
            href="/meyerwolke/legal/imprint"
            className="hover:text-white transition-colors"
          >
            Impressum
          </Link>
          <span className="mx-1.5">·</span>
          <Link
            href="/meyerwolke/legal/privacy"
            className="hover:text-white transition-colors"
          >
            Datenschutzerklärung
          </Link>
        </span>
      </div>
    </div>
  );
}
