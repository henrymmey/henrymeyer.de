"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import { adminApi } from "@/lib/admin/client";
import MarkdownEditor from "@/components/admin/markdown-editor";
import { Button, EmptyState, Skeleton } from "@/components/admin/ui";

export default function EventMarkdownPage() {
  const { slug } = useParams<{ slug: string }>();
  const [markdown, setMarkdown] = useState<string | null | undefined>(
    undefined,
  );
  const [eventName, setEventName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .getEvent(slug)
      .then((data) => {
        if (!active) return;
        setEventName(data.event.name);
        return adminApi.getMarkdown(slug);
      })
      .then((data) => active && setMarkdown(data?.markdown ?? ""))
      .catch(() => active && setMarkdown(null));
    return () => {
      active = false;
    };
  }, [slug]);

  if (markdown === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (markdown === null) {
    return (
      <EmptyState
        icon={<CalendarDays className="size-10" aria-hidden="true" />}
        title="Event nicht gefunden"
        description={`Das Event mit dem Slug "${slug}" existiert nicht (mehr).`}
        action={
          <Button href="/admin/events" variant="secondary">
            Zurück zu Events
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/admin/events/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {eventName ? `Zurück zu ${eventName}` : "Zurück zum Event"}
        </Link>
        <h1 className="mt-3 flex items-center gap-2 font-pixel text-2xl uppercase leading-tight text-foreground md:text-3xl">
          <FileText className="size-6 text-grass" aria-hidden="true" />
          Markdown
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Bearbeite die Detailseite von{" "}
          <span className="text-foreground">{eventName ?? slug}</span>. Live-Vorschau
          nutzt die öffentliche Render-Logik (Markdown, ohne HTML).
        </p>
      </div>

      <MarkdownEditor
        slug={slug}
        initialMarkdown={markdown}
        onSaved={() => {
          /* optionaler Hook */
        }}
      />
    </div>
  );
}