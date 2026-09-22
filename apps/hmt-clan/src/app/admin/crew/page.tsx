"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, Users } from "lucide-react";
import type { CrewMember } from "@/lib/crew";
import { adminApi } from "@/lib/admin/client";
import CrewForm from "@/components/admin/crew-form";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Pill,
  Skeleton,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

export default function AdminCrewPage() {
  const toast = useToast();
  const [members, setMembers] = useState<CrewMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CrewMember | null>(null);
  const [formSession, setFormSession] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<CrewMember | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [moving, setMoving] = useState(false);

  async function reload() {
    try {
      setMembers(await adminApi.listCrew());
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
      .listCrew()
      .then((data) => active && setMembers(data))
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

  async function move(index: number, direction: -1 | 1) {
    const list = members;
    if (!list) return;
    const target = index + direction;
    if (target < 0 || target >= list.length) return;

    const next = [...list];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);

    setMoving(true);
    try {
      const result = await adminApi.reorderCrew(next.map((member) => member.slug));
      setMembers(result.members);
      toast.success(
        "Reihenfolge gespeichert",
        direction === -1 ? "Nach oben verschoben." : "Nach unten verschoben.",
      );
    } catch (cause) {
      toast.error(
        "Reihenfolge konnte nicht gespeichert werden",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
      await reload();
    } finally {
      setMoving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteMember(deleteTarget.slug);
      toast.success(
        "Mitglied gelöscht",
        "Das Mitglied wurde aus crew.json entfernt.",
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

  function openEdit(member: CrewMember) {
    setEditing(member);
    setFormSession((session) => session + 1);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Crew"
        description="Crew-Mitglieder sortieren, bearbeiten. Änderungen werden einzeln committet und mit „Speichern“ (oben rechts) zusammen gepusht."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus className="size-4" aria-hidden="true" />
            Mitglied hinzufügen
          </Button>
        }
      />

      {error && (
        <div className="rounded-block border border-redstone/40 bg-redstone/10 px-4 py-3 text-sm text-redstone">
          {error}
        </div>
      )}

      {!members ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[4.25rem]" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={<Users className="size-10" aria-hidden="true" />}
          title="Keine Mitglieder"
          description="Füge deine ersten Crew-Mitglieder hinzu."
          action={
            <Button variant="primary" onClick={openCreate}>
              <Plus className="size-4" aria-hidden="true" />
              Mitglied hinzufügen
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {members.map((member, index) => (
            <li
              key={member.slug}
              className="flex items-center gap-3 rounded-block border border-black/60 bg-surface-3 p-3 shadow-card md:px-4"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={`${member.name} nach oben verschieben`}
                  disabled={index === 0 || moving}
                  onClick={() => move(index, -1)}
                  className="rounded-base p-1 text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
                >
                  <ChevronUp className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`${member.name} nach unten verschieben`}
                  disabled={index === members.length - 1 || moving}
                  onClick={() => move(index, 1)}
                  className="rounded-base p-1 text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-main-foreground">
                    {member.name}
                  </p>
                  {member.inactive ? (
                    <Pill variant="inactive">Inaktiv</Pill>
                  ) : (
                    <Pill variant="active">Aktiv</Pill>
                  )}
                  {(member.rollen ?? []).map((rolle) => (
                    <Pill key={rolle} variant="default">
                      {rolle}
                    </Pill>
                  ))}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                  <span>Slug: {member.slug}</span>
                  <span>Minecraft: {member.minecraftUser || "—"}</span>
                  {member.seasons && member.seasons.length > 0 && (
                    <span>Seasons: {member.seasons.join(", ")}</span>
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEdit(member)}
                  aria-label={`${member.name} bearbeiten`}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Bearbeiten
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteTarget(member)}
                  aria-label={`${member.name} löschen`}
                  className="hover:border-redstone/50 hover:text-redstone"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CrewForm
        key={formSession}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        member={editing}
        onSaved={reload}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Mitglied löschen?"
        description={`"${deleteTarget?.name}" wird dauerhaft aus crew.json entfernt.`}
        confirmLabel="Löschen"
      />
    </div>
  );
}