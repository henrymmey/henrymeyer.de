import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import StatsDisplay from "@/components/stats-display";
import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import { getMemberRoles, type CrewMember } from "@/lib/crew";

function roleVariant(role: string) {
  const key = role.trim().toLowerCase();
  if (key === "gründer") {
    return "grass";
  }
  if (key === "spieler") {
    return "magenta";
  }
  return "stone";
}

export default function CrewCard({ member }: { member: CrewMember }) {
  const skinSrc =
    member.useskin === false
      ? "/skins/blank.png"
      : `/skins/${member.minecraftUser}.png`;

  const roles = getMemberRoles(member);

  return (
    <Link
      href={`/crew/${member.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(to_bottom,var(--hmt-surface-2),var(--hmt-surface))]">
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

      <div className="relative flex flex-1 flex-col border-t border-white/5 px-3 pb-4 pt-3 text-center">
        <p className="font-pixel text-[15px] leading-tight text-main-foreground transition-colors duration-200 group-hover:text-grass">
          {member.name}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {roles.map((role) => (
            <MinecraftBadge
              key={role}
              variant={roleVariant(role)}
              className="px-1.5 py-0.5"
            >
              {role}
            </MinecraftBadge>
          ))}
        </div>
        <Suspense fallback={null}>
          <StatsDisplay slug={member.thescape_slug} />
        </Suspense>
      </div>
    </Link>
  );
}