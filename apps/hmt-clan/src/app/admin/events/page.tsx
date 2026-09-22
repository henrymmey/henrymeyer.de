"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Copy,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adminApi,
  type EventListItem,
} from "@/lib/admin/client";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Pill,
  SearchInput,
  Skeleton,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

type Filter = "all" | "published" | "draft";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "published", label: "Veröffentlicht" },
  { key: "draft", label: "Entwurf" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(dateIso: string): string {
  return new Date(dateIso + "T00:00:00").toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminEventsPage() {
  const toast = useToast();
  const [events, setEvents] = useState<EventListItem[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);

  async function reload() {
    try {
      setEvents(await adminApi.listEvents());
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Fehler beim Laden.",
      );
    }
  }

  useEffect(() => {
    let active = true;
    adminApi
      .listEvents()
      .then((data) => active && setEvents(data))
      .catch((cause: unknown) =>
        active &&
        setError(
          cause instanceof Error ? cause.message : "Fehler beim Laden.",
        ),
      );
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!events) return null;
    let list = [...events];
    if (filter === "published") list = list.filter((event) => event.show);
    if (filter === "draft") list = list.filter((event) => !event.show);
    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (event) =>
          event.name.toLowerCase().includes(needle) ||
          event.slug.toLowerCase().includes(needle) ||
          event.description.toLowerCase().includes(needle),
      );
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [events, filter, query]);

  async function togglePublish(event: EventListItem) {
    setPublishing(event.slug);
    try {
      await adminApi.updateEvent(event.slug, { show: !event.show });
      await reload();
    } catch (cause) {
      toast.error(
        "Aktualisieren fehlgeschlagen",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
    } finally {
      setPublishing(null);
    }
  }

  async function duplicateEvent(event: EventListItem) {
    try {
      const copy = event.name + " (Kopie)";
      const baseSlug = slugify(copy);
      const events_ = events ?? [];
      let slug = baseSlug;
      let counter = 2;
      while (events_.some((candidate) => candidate.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
      }
      const created = await adminApi.createEvent({
        name: copy,
        slug,
        description: event.description,
        date: event.date,
        time: event.time ?? null,
        showTime: event.showTime,
        show: false,
        showDetailsButton: event.showDetailsButton,
        done: event.done,
        icon: event.icon ?? null,
        season: event.season ?? null,
        links: event.links ?? null,
      });
      await reload();
      toast.success("Event dupliziert", "Das Duplikat wurde als Entwurf erstellt.");
      window.location.href = `/admin/events/${created.event.slug}`;
    } catch (cause) {
      toast.error(
        "Duplizieren fehlgeschlagen",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteEvent(deleteTarget.slug);
      toast.success("Event gelöscht", "Das Event wurde auf GitHub entfernt.");
      setDeleteTarget(null);
      await reload();
    } catch (cause) {
      toast.error(
        "Löschen fehlgeschlagen",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Events"
        description="Events verwalten und als JSON direkt auf GitHub committen."
        actions={
          <Button href="/admin/events/new" variant="primary">
            <Plus className="size-4" aria-hidden="true" />
            Neues Event
          </Button>
        }
      />

      {error && (
        <div className="rounded-block border border-redstone/40 bg-redstone/10 px-4 py-3 text-sm text-redstone">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter"
          className="inline-flex self-start rounded-base border border-black/50 bg-surface-2 p-1"
        >
          {FILTERS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={filter === tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "rounded-[3px] px-3 py-1.5 text-xs transition-colors",
                filter === tab.key
                  ? "bg-surface-3 text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Events suchen..."
          className="sm:w-72"
        />
      </div>

      {!events ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[4.25rem]" />
          ))}
        </div>
      ) : filtered!.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-10" aria-hidden="true" />}
          title="Keine Events gefunden"
          description={
            query
              ? "Die Suche hat keine Treffer ergeben. Filter oder Suchbegriff anpassen."
              : "Lege dein erstes Event an – es erscheint sofort hier."
          }
          action={
            <Button href="/admin/events/new" variant="primary">
              <Plus className="size-4" aria-hidden="true" />
              Neues Event
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered!.map((event) => (
            <li
              key={event.slug}
              className="flex flex-col gap-3 rounded-block border border-black/60 bg-surface-3 p-4 shadow-card transition-colors hover:border-black/80 hover:bg-surface-hover md:flex-row md:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/events/${event.slug}`}
                    className="truncate text-sm font-semibold text-main-foreground transition-colors hover:text-grass"
                  >
                    {event.name}
                  </Link>
                  {event.show ? (
                    <Pill variant="published">Veröffentlicht</Pill>
                  ) : (
                    <Pill variant="draft">Entwurf</Pill>
                  )}
                  {event.done && <Pill variant="past">Vergangen</Pill>}
                  {event.hasMarkdown && (
                    <Pill variant="default">
                      <FileText className="size-3" aria-hidden="true" />
                      MD
                    </Pill>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-muted md:max-w-xl">
                  {event.description || "Keine Beschreibung."}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span>{formatDate(event.date)}</span>
                  <span>Slug: {event.slug}</span>
                  {event.season && <span>Season: {event.season}</span>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => togglePublish(event)}
                  loading={publishing === event.slug}
                >
                  {event.show ? "Unpublizieren" : "Veröffentlichen"}
                </Button>
                <Button size="sm" variant="ghost" href={`/admin/events/${event.slug}`}>
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Bearbeiten
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  href={`/admin/events/${event.slug}/markdown`}
                >
                  <FileText className="size-3.5" aria-hidden="true" />
                  Markdown
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  href={`/events/${event.slug}`}
                  external
                  aria-label={`Event auf der Website öffnen`}
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => duplicateEvent(event)}
                  aria-label="Event duplizieren"
                >
                  <Copy className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteTarget(event)}
                  aria-label="Event löschen"
                  className="hover:border-redstone/50 hover:text-redstone"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Event löschen?"
        description={`"${deleteTarget?.name}" wird dauerhaft aus events.json entfernt. Falls vorhanden, wird auch die Markdown-Datei gelöscht. Dieser Schritt committet direkt auf GitHub.`}
        confirmLabel="Löschen"
      />
    </div>
  );
}