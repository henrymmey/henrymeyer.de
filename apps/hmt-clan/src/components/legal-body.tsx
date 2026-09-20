"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LegalBody({ content }: { content: string }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed md:text-base prose prose-invert max-w-none prose-headings:font-pixel prose-headings:mt-6 prose-headings:mb-2 prose-headings:text-main-foreground prose-p:leading-relaxed prose-p:text-muted prose-a:text-emerald prose-strong:text-main-foreground prose-ul:list-disc prose-ul:space-y-1 prose-ul:pl-5 prose-li:text-muted [&_h2:first-child]:mt-0">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}