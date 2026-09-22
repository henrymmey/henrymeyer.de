"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import {
  adminApi,
  CHANGES_EVENT,
  type StagingStatus,
} from "@/lib/admin/client";
import { Button, ConfirmDialog } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

export default function StagingButton() {
  const toast = useToast();
  const pathname = usePathname();
  const [status, setStatus] = useState<StagingStatus | null>(null);
  const [flushing, setFlushing] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  useEffect(() => {
    let active = true;
    adminApi
      .stagingStatus()
      .then((next) => active && setStatus(next))
      .catch(() => {
        /* Status nicht verfügbar – letzten Stand behalten. */
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    const onChange = () => {
      adminApi
        .stagingStatus()
        .then(setStatus)
        .catch(() => {
          /* Status nicht verfügbar. */
        });
    };
    window.addEventListener(CHANGES_EVENT, onChange);
    return () => window.removeEventListener(CHANGES_EVENT, onChange);
  }, []);

  async function reloadStatus() {
    try {
      setStatus(await adminApi.stagingStatus());
    } catch {
      /* Status nicht verfügbar. */
    }
  }

  async function handleFlush() {
    setFlushing(true);
    try {
      const result = await adminApi.flushStaging();
      const mainBranch = status?.mainBranch ?? "main";
      if (result.commitsPushed > 0) {
        toast.success(
          "Gespeichert",
          `${result.commitsPushed} ${
            result.commitsPushed === 1 ? "Commit" : "Commits"
          } zusammen auf ${mainBranch} gepusht – genau ein Build.`,
        );
      } else {
        toast.info("Alles gespeichert", "Es gibt keine offenen Änderungen.");
      }
      await reloadStatus();
    } catch (cause) {
      toast.error(
        "Speichern fehlgeschlagen",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
    } finally {
      setFlushing(false);
    }
  }

  async function handleDiscard() {
    setDiscarding(true);
    try {
      const result = await adminApi.discardStaging();
      toast.success(
        "Verworfen",
        result.discards > 0
          ? `${result.discards} offene ${
              result.discards === 1 ? "Änderung" : "Änderungen"
            } verworfen.`
          : "Es gab keine offenen Änderungen.",
      );
      await reloadStatus();
    } catch (cause) {
      toast.error(
        "Verwerfen fehlgeschlagen",
        cause instanceof Error ? cause.message : "Unbekannter Fehler.",
      );
    } finally {
      setDiscarding(false);
      setConfirmDiscard(false);
    }
  }

  const hasChanges = Boolean(status?.hasChanges);
  const count = status?.aheadBy ?? 0;

  return (
    <div className="flex items-center gap-2">
      {hasChanges && (
        <span className="hidden items-center gap-1.5 text-xs text-grass sm:inline-flex">
          <span className="size-1.5 animate-pulse rounded-full bg-grass" />
          {count} offen
        </span>
      )}

      {hasChanges && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => setConfirmDiscard(true)}
          loading={discarding}
          className="hover:brightness-110"
          title="Alle offenen Commits auf dem Staging-Branch verwerfen. Nichts wird auf main gepusht."
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Verwerfen
        </Button>
      )}

      <Button
        variant={hasChanges ? "primary" : "secondary"}
        size="sm"
        onClick={handleFlush}
        loading={flushing}
        disabled={!hasChanges}
        title={
          status
            ? `${count} ${count === 1 ? "offener Commit" : "offene Commits"} auf ${
                status.stagingBranch ?? "admin-stage"
              }. Ein Klick pusht alle zusammen auf ${status.mainBranch}.`
            : "Lädt Staging-Status…"
        }
      >
        <Save className="size-3.5" aria-hidden="true" />
        Speichern
        {hasChanges && (
          <span className="rounded-[2px] bg-black/25 px-1.5 py-0.5 text-[9px] tabular-nums">
            {count}
          </span>
        )}
      </Button>

      <ConfirmDialog
        open={confirmDiscard}
        onClose={() => setConfirmDiscard(false)}
        onConfirm={handleDiscard}
        loading={discarding}
        title="Offene Änderungen verwerfen?"
        description={`${count} ${
          count === 1 ? "vorgemerkter Commit" : "vorgemerkte Commits"
        } auf dem Staging-Branch werden dauerhaft verworfen. Nichts davon wird auf ${
          status?.mainBranch ?? "main"
        } gepusht.`}
        confirmLabel="Verwerfen"
      />
    </div>
  );
}