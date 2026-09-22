"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import type { EventConfig } from "@/lib/events/types";
import { adminApi } from "@/lib/admin/client";
import EventForm from "@/components/admin/event-form";
import { Button, EmptyState, Skeleton } from "@/components/admin/ui";

export default function EditEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventConfig | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    adminApi
      .getEvent(slug)
      .then((data) => active && setEvent(data.event))
      .catch(() => active && setEvent(null));
    return () => {
      active = false;
    };
  }, [slug]);

  if (event === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (event === null) {
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Zurück zu Events
          </Link>
          <h1 className="mt-3 font-pixel text-2xl uppercase leading-tight text-foreground md:text-3xl">
            {event.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Änderungen werden einzeln committet und mit „Speichern”
            (oben rechts) zusammen gepusht.
          </p>
        </div>
        <Button variant="ghost" href={`/admin/events/${event.slug}/markdown`}>
          <FileText className="size-4" aria-hidden="true" />
          Markdown bearbeiten
        </Button>
      </div>
      <EventForm event={event} />
    </div>
  );
}