"use client";

import Link from "next/link";
import { useConsent } from "@/components/consent-provider";
import MinecraftButton from "@/components/minecraft/minecraft-button";

export default function CookieBanner() {
  const { snapshot, isDialogOpen, grant, deny } = useConsent();

  if (!snapshot.hydrated || snapshot.status !== null || isDialogOpen) {
    return null;
  }

  return (
    <aside
      role="region"
      aria-label="Cookie-Einwilligung"
      className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-block border border-black/60 bg-surface-3 p-4 shadow-lift"
    >
      <p className="mb-4 text-sm leading-relaxed text-muted">
        Für externe Dienste wie Google Calendar benötigen wir deine
        Einwilligung. Du kannst diese jederzeit widerrufen. Details findest du
        in der{" "}
        <Link
          href="/legal/privacy"
          className="text-foreground underline decoration-emerald/40 underline-offset-2 transition-colors hover:text-foreground"
        >
          Datenschutzerklärung
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <MinecraftButton
          type="button"
          variant="primary"
          size="sm"
          onClick={grant}
          className="flex-1"
        >
          Akzeptieren
        </MinecraftButton>
        <MinecraftButton
          type="button"
          variant="stone"
          size="sm"
          onClick={deny}
          className="flex-1"
        >
          Ablehnen
        </MinecraftButton>
      </div>
    </aside>
  );
}
