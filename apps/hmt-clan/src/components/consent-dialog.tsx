"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useConsent } from "@/components/consent-provider";
import MinecraftButton from "@/components/minecraft/minecraft-button";

const statusText: Record<string, string> = {
  granted: "Einwilligung erteilt – externe Widgets werden geladen.",
  denied: "Abgelehnt – externe Widgets bleiben deaktiviert.",
};

function StatusLine({ status }: { status: "granted" | "denied" | null }) {
  if (status === null) {
    return <span className="text-muted">Noch keine Auswahl getroffen.</span>;
  }
  return <span className="text-foreground/70">{statusText[status]}</span>;
}

export default function ConsentDialog() {
  const { snapshot, isDialogOpen, grant, deny, closeDialog } = useConsent();

  useEffect(() => {
    if (!isDialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isDialogOpen, closeDialog]);

  if (!isDialogOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Dialog schließen"
        onClick={closeDialog}
        className="absolute inset-0 h-full w-full cursor-default bg-overlay backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-lift">
        <div className="texture texture-stone tex-24 relative border-b-2 border-black/50 bg-black/10 px-6 py-4">
          <div className="relative flex items-start justify-between gap-4">
            <h2 className="font-pixel text-base uppercase tracking-[0.12em] text-foreground">
              Cookie-Einstellungen
            </h2>
            <button
              type="button"
              aria-label="Schließen"
              onClick={closeDialog}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-block border border-black/50 bg-surface-2 text-foreground shadow-[0_2px_0_rgb(0_0_0/0.5)] transition-all duration-150 hover:-translate-y-px hover:bg-surface-hover active:translate-y-px active:shadow-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm leading-relaxed text-muted">
            Für externe Dienste wie den Discord-Server benötigen wir deine
            Einwilligung. Du kannst deine Wahl hier jederzeit ändern.
          </p>
          <p className="mt-4 text-xs leading-relaxed">
            <StatusLine status={snapshot.status} /> Mehr dazu in der{" "}
            <Link
              href="/legal/privacy"
              className="text-foreground underline decoration-emerald/40 underline-offset-2 hover:text-foreground"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
          <div className="mt-6 flex gap-3">
            <MinecraftButton type="button" variant="primary" onClick={grant} className="flex-1">
              Akzeptieren
            </MinecraftButton>
            <MinecraftButton type="button" variant="stone" onClick={deny} className="flex-1">
              Ablehnen
            </MinecraftButton>
          </div>
        </div>
      </div>
    </div>
  );
}