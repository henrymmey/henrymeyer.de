"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function EventBody({ body }: { body: string | null }) {
  if (!body) return null;

  return (
    <div className="prose prose-invert max-w-none prose-headings:font-pixel prose-headings:text-main-foreground prose-p:leading-relaxed prose-p:text-muted prose-a:text-emerald prose-strong:text-main-foreground prose-code:text-foreground/90 prose-pre:bg-background prose-hr:border-border">
      <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
    </div>
  );
}