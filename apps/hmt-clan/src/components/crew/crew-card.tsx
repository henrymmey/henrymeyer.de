import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import StatsDisplay from "@/components/stats-display";
import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import type { CrewMember } from "@/lib/crew";

export default function CrewCard({ member }: { member: CrewMember }) {
  const skinSrc =
    member.useskin === false
      ? "/skins/blank.png"
      : `/skins/${member.minecraftUser}.png`;

  const isFounder = member.rolle.trim().toLowerCase() === "gründer";

  return (
    <Link
      href={`/crew/${member.slug}`}
      className="group block h-full overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative overflow-hidden bg-[linear-gradient(to_bottom,var(--hmt-surface-2),var(--hmt-surface))]">
        <div className="transition-transform duration-500 group-hover:-translate-y-2">
          <Image
            src={skinSrc}
            alt={`Skin von ${member.minecraftUser}`}
            width={600}
            height={800}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
            className="aspect-[3/4] w-full object-contain"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-surface"
        />
      </div>

      <div className="relative border-t border-white/5 px-3 pb-4 pt-3 text-center">
        <p className="font-pixel text-[15px] leading-tight text-main-foreground transition-colors duration-200 group-hover:text-grass">
          {member.name}
        </p>
        <div className="mt-2 flex justify-center">
          <MinecraftBadge
            variant={isFounder ? "grass" : "stone"}
            className="px-1.5 py-0.5"
          >
            {member.rolle}
          </MinecraftBadge>
        </div>
        <Suspense fallback={null}>
          <StatsDisplay slug={member.thescape_slug} />
        </Suspense>
      </div>
    </Link>
  );
}