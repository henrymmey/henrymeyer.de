"use client";

import { useEffect, useState } from "react";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import type { SeasonConfig } from "@/lib/season";
import { adminApi } from "@/lib/admin/client";
import SeasonForm from "@/components/admin/season-form";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Pill,
  Skeleton,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

export default function AdminSeasonsPage() {
  const toast = useToast();
  const [seasons, setSeasons] = useState<SeasonConfig[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SeasonConfig | null>(null);
  const [formSession, setFormSession] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<SeasonConfig | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function reload() {
    try {
      const list = await adminApi.listSeasons();
      setSeasons(
        [...list].sort(
          (a, b) => a.priority - b.priority || a.start.localeCompare(b.start),
        ),
      );
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
      .listSeasons()
      .then((data) =>
        active &&
        setSeasons(
          [...data].sort(
            (a, b) => a.priority - b.priority || a.start.localeCompare(b.start),
          ),
        ),
      )
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

  function isCurrentlyActive(season: SeasonConfig): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return season.start <= today && season.end >= today;
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteSeason(deleteTarget.slug);
      toast.success(
        "Season gelöscht",
        "Die Season wurde aus season.json entfernt.",
      );
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

  function openCreate() {
    setEditing(null);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  function openEdit(season: SeasonConfig) {
    setEditing(season);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Seasons"
        description="Seasons mit Zeiträumen verwalten und direkt auf GitHub committen."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus className="size-4" aria-hidden="true" />
            Season hinzufügen
          </Button>
        }
      />

      {error && (
        <div className="rounded-block border border-redstone/40 bg-redstone/10 px-4 py-3 text-sm text-redstone">
          {error}
        </div>
      )}

      {!seasons ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[4.5rem]" />
          ))}
        </div>
      ) : seasons.length === 0 ? (
        <EmptyState
          icon={<Layers className="size-10" aria-hidden="true" />}
          title="Keine Seasons"
          description="Lege deine erste Season an."
          action={
            <Button variant="primary" onClick={openCreate}>
              <Plus className="size-4" aria-hidden="true" />
              Season hinzufügen
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {seasons.map((season) => (
            <li
              key={season.slug}
              className="flex flex-col gap-3 rounded-block border border-black/60 bg-surface-3 p-4 shadow-card md:flex-row md:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-main-foreground">
                    {season.name}
                  </p>
                  {isCurrentlyActive(season) && (
                    <Pill variant="published">Aktiv</Pill>
                  )}
                  {season.showEvents !== false && (
                    <Pill variant="upcoming">Events</Pill>
                  )}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                  <span>Slug: {season.slug}</span>
                  <span>
                    {season.start} bis {season.end}
                  </span>
                  <span>Priorität: {season.priority}</span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEdit(season)}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Bearbeiten
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteTarget(season)}
                  aria-label={`${season.name} löschen`}
                  className="hover:border-redstone/50 hover:text-redstone"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SeasonForm
        key={formSession}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        season={editing}
        onSaved={reload}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Season löschen?"
        description={`"${deleteTarget?.name}" wird dauerhaft aus season.json entfernt. Events und Crew-Mitglieder verlieren ihren Season-Bezug nicht, zeigen aber keine Season-Section mehr.`}
        confirmLabel="Löschen"
      />
    </div>
  );
}