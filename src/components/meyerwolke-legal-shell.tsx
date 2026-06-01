import Link from "next/link";
import type { ReactNode } from "react";

type MeyerWolkeLegalShellProps = {
  title: string;
  lead?: string;
  children: ReactNode;
};

export default function MeyerWolkeLegalShell({
  title,
  children,
}: MeyerWolkeLegalShellProps) {
  return (
    <main className="w-full max-w-[480px] bg-[#2D3330] rounded-xl shadow-2xl shadow-black/30 overflow-hidden border border-white/5 mx-auto">
      <div className="px-6 py-8 sm:px-8">
        <h1 className="text-xl font-bold text-white mb-6 tracking-wide text-center">
          {title}
        </h1>

        <div className="mb-6 flex justify-center">
          <Link
            href="https://meyerwolke.de/"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#81b59e] px-6 py-2.5 text-sm font-semibold text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-colors hover:bg-[#8cc1aa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8f0e7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D3330]"
          >
            Zurück zu MeyerWolke
          </Link>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#ededed] [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2:first-child]:mt-0 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:text-[#82bdab] hover:[&_a]:text-white [&_a]:transition-colors [&_a]:underline-offset-2 hover:[&_a]:underline">
          {children}
        </div>
      </div>
    </main>
  );
}
