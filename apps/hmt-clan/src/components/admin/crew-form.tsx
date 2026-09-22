"use client";

import { useState } from "react";
import type { CrewMember } from "@/lib/crew";
import { adminApi } from "@/lib/admin/client";
import type { CrewCreateInput } from "@/lib/admin/schemas";
import {
  Button,
  Field,
  Input,
  Modal,
  Textarea,
  Toggle,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

interface FormValues {
  name: string;
  slug: string;
  rollen: string;
  minecraftUser: string;
  useskin: boolean;
  showLaby: boolean;
  labySlug: string;
  thescape_slug: string;
  priority: string;
  seasons: string;
  inactive: boolean;
}

function initialFromMember(member: CrewMember | null): FormValues {
  return {
    name: member?.name ?? "",
    slug: member?.slug ?? "",
    rollen: member?.rollen?.join(", ") ?? "",
    minecraftUser: member?.minecraftUser ?? "",
    useskin: member?.useskin ?? true,
    showLaby: member?.showLaby ?? false,
    labySlug: member?.labySlug ?? "",
    thescape_slug: member?.thescape_slug ?? "",
    priority: member?.priority != null ? String(member.priority) : "",
    seasons: member?.seasons?.join(", ") ?? "",
    inactive: member?.inactive ?? false,
  };
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CrewForm({
  open,
  onClose,
  member,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  member: CrewMember | null;
  onSaved: () => void;
}) {
  const isEdit = member !== null;
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(() =>
    initialFromMember(member),
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function buildPayload(): CrewCreateInput {
    return {
      name: values.name.trim(),
      slug: values.slug.trim(),
      rollen: splitList(values.rollen),
      minecraftUser: values.minecraftUser.trim(),
      useskin: values.useskin,
      showLaby: values.showLaby,
      labySlug: values.labySlug.trim(),
      thescape_slug: values.thescape_slug.trim(),
      priority: values.priority.trim() ? Number(values.priority) : 0,
      seasons: splitList(values.seasons),
      inactive: values.inactive,
    };
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.updateMember(member.slug, buildPayload());
        toast.success(
          "Mitglied gespeichert",
          "Als Commit vorgemerkt – mit „Speichern” oben rechts wird gepusht.",
        );
      } else {
        await adminApi.createMember(buildPayload());
        toast.success(
          "Mitglied erstellt",
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
      title={isEdit ? "Mitglied bearbeiten" : "Neues Mitglied"}
      description={
        isEdit
          ? `Änderungen an "${member.name}" werden als Commit vorgemerkt und mit „Speichern” (oben rechts) gepusht.`
          : "Lege ein neues Crew-Mitglied an."
      }
      size="lg"
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
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="crew-name" required>
            <Input
              id="crew-name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="z. B. Henry"
              autoFocus
            />
          </Field>
          <Field label="Slug" htmlFor="crew-slug" required>
            <Input
              id="crew-slug"
              value={values.slug}
              onChange={(event) => set("slug", event.target.value)}
              placeholder="henry"
            />
          </Field>
          <Field
            label="Rollen"
            htmlFor="crew-rollen"
            hint="Kommagetrennt, z. B. Leader, Founder"
          >
            <Textarea
              id="crew-rollen"
              value={values.rollen}
              onChange={(event) => set("rollen", event.target.value)}
              placeholder="Leader, Founder"
              className="min-h-16"
            />
          </Field>
          <Field label="Minecraft-Name" htmlFor="crew-minecraft">
            <Input
              id="crew-minecraft"
              value={values.minecraftUser}
              onChange={(event) => set("minecraftUser", event.target.value)}
              placeholder="Henry"
            />
          </Field>
          <Field label="Priorität" htmlFor="crew-priority">
            <Input
              id="crew-priority"
              type="number"
              value={values.priority}
              onChange={(event) => set("priority", event.target.value)}
              placeholder="Automatisch"
            />
          </Field>
          <Field
            label="Laby-Slug"
            htmlFor="crew-laby"
            hint="Nur wenn showLaby aktiviert ist."
          >
            <Input
              id="crew-laby"
              value={values.labySlug}
              onChange={(event) => set("labySlug", event.target.value)}
              placeholder="z. B. henry"
            />
          </Field>
          <Field label="TheScape-Slug" htmlFor="crew-thescape">
            <Input
              id="crew-thescape"
              value={values.thescape_slug}
              onChange={(event) => set("thescape_slug", event.target.value)}
              placeholder="z. B. henry"
            />
          </Field>
          <Field
            label="Seasons"
            htmlFor="crew-seasons"
            hint="Season-Slugs, kommagetrennt"
          >
            <Input
              id="crew-seasons"
              value={values.seasons}
              onChange={(event) => set("seasons", event.target.value)}
              placeholder="s2, s3"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Toggle
            checked={values.useskin}
            onChange={(checked) => set("useskin", checked)}
            label="Skin verwenden"
            description="Rendert den Minecraft-Skin."
          />
          <Toggle
            checked={values.showLaby}
            onChange={(checked) => set("showLaby", checked)}
            label="LabyMod anzeigen"
            description="Zeigt den Laby-Link auf der Detailseite."
          />
          <Toggle
            checked={values.inactive}
            onChange={(checked) => set("inactive", checked)}
            label="Inaktiv"
            description={'Mitglied unter "Inaktiv" führen.'}
          />
        </div>
      </form>
    </Modal>
  );
}