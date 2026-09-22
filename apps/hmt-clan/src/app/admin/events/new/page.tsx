import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zurück zu Events
        </Link>
        <h1 className="mt-3 font-pixel text-2xl uppercase leading-tight text-foreground md:text-3xl">
          Neues Event
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Das Event wird als Entwurf angelegt und als Commit vorgemerkt –
          mit „Speichern” oben rechts wird gepusht.
        </p>
      </div>
      <EventForm event={null} />
    </div>
  );
}