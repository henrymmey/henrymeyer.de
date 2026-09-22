"use client";

import { useState } from "react";
import type { SeasonConfig } from "@/lib/season";
import { adminApi } from "@/lib/admin/client";
import type { SeasonCreateInput } from "@/lib/admin/schemas";
import {
  Button,
  Field,
  Input,
  Modal,
  Toggle,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

interface FormValues {
  name: string;
  slug: string;
  start: string;
  end: string;
  priority: string;
  showEvents: boolean;
}

function initialFromSeason(season: SeasonConfig | null): FormValues {
  return {
    name: season?.name ?? "",
    slug: season?.slug ?? "",
    start: season?.start ?? new Date().toISOString().slice(0, 10),
    end: season?.end ?? new Date().toISOString().slice(0, 10),
    priority: season?.priority != null ? String(season.priority) : "",
    showEvents: season?.showEvents ?? true,
  };
}

export default function SeasonForm({
  open,
  onClose,
  season,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  season: SeasonConfig | null;
  onSaved: () => void;
}) {
  const isEdit = season !== null;
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(() =>
    initialFromSeason(season),
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function buildPayload(): SeasonCreateInput {
    return {
      name: values.name.trim(),
      slug: values.slug.trim(),
      start: values.start,
      end: values.end,
      priority: values.priority.trim() ? Number(values.priority) : 0,
      showEvents: values.showEvents,
    };
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.updateSeason(season.slug, buildPayload());
        toast.success(
          "Season gespeichert",
          "Als Commit vorgemerkt – mit „Speichern” oben rechts wird gepusht.",
        );
      } else {
        await adminApi.createSeason(buildPayload());
        toast.success(
          "Season erstellt",
          "Als Commit vorgemerkt – mit „Speichern” oben rechts wird gepusht.",
        );
      }
      onClose();
      onSaved();
    } catch (cause) {
      toast.error(
        "Speichern fehlgeschlagen",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Season bearbeiten" : "Neue Season"}
      description={
        isEdit
          ? `Änderungen an "${season.name}" werden als Commit vorgemerkt und mit „Speichern” (oben rechts) gepusht.`
          : "Lege eine neue Season mit Zeitraum an."
      }
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" loading={saving} onClick={handleSubmit}>
            {isEdit ? "Speichern" : "Erstellen"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        noValidate
      >
        <Field label="Name" htmlFor="season-name" required>
          <Input
            id="season-name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="z. B. Season 3"
            autoFocus
          />
        </Field>
        <Field label="Slug" htmlFor="season-slug" required>
          <Input
            id="season-slug"
            value={values.slug}
            onChange={(event) => set("slug", event.target.value)}
            placeholder="s3"
          />
        </Field>
        <Field label="Start (YYYY-MM-DD)" htmlFor="season-start" required>
          <Input
            id="season-start"
            type="date"
            value={values.start}
            onChange={(event) => set("start", event.target.value)}
          />
        </Field>
        <Field label="Ende (YYYY-MM-DD)" htmlFor="season-end" required>
          <Input
            id="season-end"
            type="date"
            value={values.end}
            onChange={(event) => set("end", event.target.value)}
          />
        </Field>
        <Field label="Priorität" htmlFor="season-priority" className="sm:col-span-2">
          <Input
            id="season-priority"
            type="number"
            value={values.priority}
            onChange={(event) => set("priority", event.target.value)}
            placeholder="Automatisch"
          />
        </Field>
        <div className="sm:col-span-2">
          <Toggle
            checked={values.showEvents}
            onChange={(checked) => set("showEvents", checked)}
            label="Events anzeigen"
            description='Zeigt die "Events dieser Season"-Section.'
          />
        </div>
      </form>
    </Modal>
  );
}