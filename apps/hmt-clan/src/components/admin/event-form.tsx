"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { EventConfig } from "@/lib/events/types";
import type { SeasonConfig } from "@/lib/season";
import { adminApi } from "@/lib/admin/client";
import {
  Button,
  Field,
  Input,
  Select,
  Textarea,
  Toggle,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

const EVENT_ICONS = [
  "chest",
  "sword",
  "map",
  "pickaxe",
  "emerald",
  "redstone",
  "ender-pearl",
  "grass",
  "crafting-table",
] as const;

const LINK_PRESETS = [
  { label: "Discord", value: "https://discord.gg/" },
  { label: "YouTube", value: "https://www.youtube.com/" },
  { label: "Twitch", value: "https://www.twitch.tv/" },
  { label: "Karte", value: "https://" },
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface LinkRow {
  displayName: string;
  url: string;
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  priority: string;
  icon: string;
  season: string;
  show: boolean;
  showTime: boolean;
  showDetailsButton: boolean;
  done: boolean;
  links: LinkRow[];
}

function initialFromEvent(event: EventConfig | null): FormValues {
  return {
    name: event?.name ?? "",
    slug: event?.slug ?? "",
    description: event?.description ?? "",
    date: event?.date ?? new Date().toISOString().slice(0, 10),
    time: event?.time ?? "",
    priority: event?.priority != null ? String(event.priority) : "",
    icon: event?.icon ?? "",
    season: event?.season ?? "",
    show: event?.show ?? false,
    showTime: event?.showTime ?? true,
    showDetailsButton: event?.showDetailsButton ?? true,
    done: event?.done ?? false,
    links: event?.links?.map((link) => ({ ...link })) ?? [],
  };
}

export default function EventForm({
  event,
}: {
  event: EventConfig | null;
}) {
  const isEdit = event !== null;
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(() =>
    initialFromEvent(event),
  );
  const [seasons, setSeasons] = useState<SeasonConfig[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    adminApi
      .listSeasons()
      .then(setSeasons)
      .catch(() => setSeasons([]));
  }, []);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleNameChange(name: string) {
    if (!isEdit && values.slug === slugify(values.name)) {
      set("slug", slugify(name));
    }
    set("name", name);
  }

  function handleLinksChange(links: LinkRow[]) {
    set("links", links);
  }

  function buildPayload() {
    const links: LinkRow[] = values.links.filter(
      (link) => link.displayName.trim() && link.url.trim(),
    );

    return {
      name: values.name.trim(),
      ...(isEdit ? {} : { slug: values.slug.trim() }),
      description: values.description.trim(),
      priority: values.priority.trim() ? Number(values.priority) : undefined,
      date: values.date,
      time: values.time.trim() ? values.time : null,
      showTime: values.showTime,
      show: values.show,
      showDetailsButton: values.showDetailsButton,
      done: values.done,
      icon: values.icon.trim() ? values.icon.trim() : null,
      season: values.season ? values.season : null,
      links: links.length > 0 ? links : null,
    };
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      if (isEdit) {
        await adminApi.updateEvent(event.slug, buildPayload());
        toast.success("Gespeichert", "Das Event wurde auf GitHub committed.");
      } else {
        const { event: created } = await adminApi.createEvent(buildPayload());
        toast.success("Event erstellt", "Das Event wurde auf GitHub committed.");
        router.push(`/admin/events/${created.slug}`);
      }
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Unbekannter Fehler.";
      if (message.toLowerCase().includes("slug")) {
        setErrors({ slug: message });
      }
      toast.error("Speichern fehlgeschlagen", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* Basis */}
      <section className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card md:p-6">
        <h2 className="mb-4 font-pixel text-sm uppercase tracking-[0.1em] text-grass">
          Allgemein
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Name" htmlFor="event-name" required>
            <Input
              id="event-name"
              value={values.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="z. B. Die große HMT-Sommerparty"
              autoFocus
            />
          </Field>
          <Field
            label="Slug"
            htmlFor="event-slug"
            required
            hint="URL-Teil. Nur a-z, 0-9 und Bindestriche."
            error={errors.slug}
          >
            <Input
              id="event-slug"
              value={values.slug}
              onChange={(event) => set("slug", event.target.value)}
              placeholder="hmt-sommerparty"
            />
          </Field>
          <Field
            label="Beschreibung"
            htmlFor="event-description"
            className="md:col-span-2"
          >
            <Textarea
              id="event-description"
              value={values.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder="Kurze Beschreibung, die auf der Event-Karte angezeigt wird."
            />
          </Field>
          <Field label="Datum (YYYY-MM-DD)" htmlFor="event-date" required>
            <Input
              id="event-date"
              type="date"
              value={values.date}
              onChange={(event) => set("date", event.target.value)}
            />
          </Field>
          <Field label="Uhrzeit (HH:mm)" htmlFor="event-time">
            <Input
              id="event-time"
              type="time"
              value={values.time}
              onChange={(event) => set("time", event.target.value)}
            />
          </Field>
          <Field label="Priorität" htmlFor="event-priority">
            <Input
              id="event-priority"
              type="number"
              value={values.priority}
              onChange={(event) => set("priority", event.target.value)}
              placeholder="Automatisch"
            />
          </Field>
          <Field label="Season" htmlFor="event-season">
            <Select
              id="event-season"
              value={values.season}
              onChange={(event) => set("season", event.target.value)}
            >
              <option value="">— Keine Season —</option>
              {seasons.map((season) => (
                <option key={season.slug} value={season.slug}>
                  {season.name} ({season.slug})
                </option>
              ))}
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field
              label="Icon"
              htmlFor="event-icon"
              hint="Bekannter Event-Icon-Name oder eigener Pfad, z. B. /events/xyz.png"
            >
              <Input
                id="event-icon"
                list="event-icons"
                value={values.icon}
                onChange={(event) => set("icon", event.target.value)}
                placeholder="chest"
              />
              <datalist id="event-icons">
                {EVENT_ICONS.map((icon) => (
                  <option key={icon} value={icon} />
                ))}
              </datalist>
            </Field>
          </div>
        </div>
      </section>

      {/* Sichtbarkeit */}
      <section className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card md:p-6">
        <h2 className="mb-4 font-pixel text-sm uppercase tracking-[0.1em] text-grass">
          Status & Anzeige
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Toggle
            checked={values.show}
            onChange={(checked) => set("show", checked)}
            label="Veröffentlicht"
            description="Sichtbar auf der Website (show)."
          />
          <Toggle
            checked={values.showTime}
            onChange={(checked) => set("showTime", checked)}
            label="Uhrzeit anzeigen"
            description="Zeigt die Uhrzeit beim Datum an."
          />
          <Toggle
            checked={values.showDetailsButton}
            onChange={(checked) => set("showDetailsButton", checked)}
            label="Details-Button"
            description="Zeigt den Link zur Detailseite."
          />
          <Toggle
            checked={values.done}
            onChange={(checked) => set("done", checked)}
            label="Vergangen"
            description="Event unter den vergangenen Events einordnen."
          />
        </div>
      </section>

      {/* Links */}
      <section className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-pixel text-sm uppercase tracking-[0.1em] text-grass">
            Links
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              handleLinksChange([
                ...values.links,
                { displayName: "", url: "" },
              ])
            }
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Link hinzufügen
          </Button>
        </div>

        {values.links.length === 0 ? (
          <p className="text-sm text-muted">
            Keine Links hinterlegt.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {values.links.map((link, index) => (
              <li
                key={index}
                className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1.6fr_auto]"
              >
                <Input
                  value={link.displayName}
                  onChange={(event) => {
                    const next = [...values.links];
                    next[index] = {
                      ...next[index],
                      displayName: event.target.value,
                    };
                    handleLinksChange(next);
                  }}
                  placeholder="Name (z. B. Discord)"
                  list={`link-presets-${index}`}
                />
                <Input
                  value={link.url}
                  onChange={(event) => {
                    const next = [...values.links];
                    next[index] = {
                      ...next[index],
                      url: event.target.value,
                    };
                    handleLinksChange(next);
                  }}
                  placeholder="https://..."
                />
                {index === 0 && (
                  <datalist id={`link-presets-${index}`}>
                    {LINK_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </datalist>
                )}
                <button
                  type="button"
                  aria-label="Link entfernen"
                  onClick={() =>
                    handleLinksChange(
                      values.links.filter((_, linkIndex) => linkIndex !== index),
                    )
                  }
                  className="inline-flex items-center justify-center self-start rounded-base border border-black/50 p-2 text-muted transition-colors hover:bg-surface-2 hover:text-redstone md:self-auto"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-black/40 pt-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/events")}
        >
          Abbrechen
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {isEdit ? "Änderungen speichern" : "Event erstellen"}
        </Button>
      </div>
    </form>
  );
}