import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/site-footer";
import MinecraftButton from "@/components/minecraft/minecraft-button";
import MinecraftBadge from "@/components/minecraft/minecraft-badge";

export const metadata: Metadata = {
  title: "404 | HMT Clan",
};

export default function NotFound() {
  return (
    <main>
      <section className="relative mx-auto flex min-h-[72svh] w-full max-w-7xl flex-col items-center justify-center overflow-hidden px-4 py-16 text-center md:px-8">
        <div
          aria-hidden="true"
          className="texture texture-obsidian tex-24 absolute inset-0 -z-10 opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-redstone/10 blur-[110px]"
        />

        <Image
          src="/commandblock.gif"
          alt="Animierter Befehlsblock"
          width={120}
          height={120}
          className="mb-8 h-auto w-32 opacity-90 md:w-40"
        />

        <MinecraftBadge variant="redstone" className="mb-5 gap-2 px-3 py-1.5">
          404 · Anzeigefehler
        </MinecraftBadge>

        <h1 className="font-pixel text-3xl uppercase leading-tight text-foreground md:text-5xl">
          Diese Seite existiert{" "}
          <span className="text-redstone">nicht.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          Da ist nur Stein und Luft. Die Seite wurde möglicherweise verschoben
          oder die URL ist falsch – nutze eine der Schnelllinks, um zur Welt
          zurückzukehren.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MinecraftButton href="/" variant="primary">
            Zur Startseite
          </MinecraftButton>
          <MinecraftButton href="/events" variant="stone">
            Events
          </MinecraftButton>
          <MinecraftButton href="/contact" variant="ghost">
            Kontakt
          </MinecraftButton>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}