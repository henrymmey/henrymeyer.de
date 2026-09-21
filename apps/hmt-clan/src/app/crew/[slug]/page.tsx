import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  Clock,
  Coins,
  Eye,
  Gamepad2,
} from "lucide-react";
import SiteFooter from "@/components/site-footer";
import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import CrewDetailTabs from "@/components/crew/crew-detail-tabs";
import { getCrewMemberBySlug, getMemberRoles } from "@/lib/crew";
import { getFullThescapeProfile } from "@/lib/thescape";

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

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = getCrewMemberBySlug(slug);

  if (!member) {
    return {
      title: "Mitglied nicht gefunden | HMT Clan",
      description: "Das gesuchte Crew-Mitglied konnte nicht gefunden werden.",
    };
  }

  return {
    title: `${member.name} | HMT Clan`,
    description: `Crew-Mitglied ${member.name} (${getMemberRoles(member).join(", ")}) beim HMT Clan.`,
  };
}

function HeaderStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted">{icon}</span>
      <span className="text-foreground">{value}</span>
      <span className="hidden text-muted sm:inline">{label}</span>
    </div>
  );
}

export default async function CrewMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = getCrewMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const profile = await getFullThescapeProfile(member.thescape_slug);

  const hasHeaderStats = Boolean(
    profile.playTime || profile.lastSeen || profile.coins,
  );

  const roles = getMemberRoles(member);

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
        <Link
          href="/crew"
          className="mb-6 inline-flex items-center gap-1.5 font-pixel text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zurück
        </Link>

        <section className="rounded-block border border-black/60 bg-surface-3 p-5 shadow-card md:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            <div className="relative shrink-0 rounded-block border-2 border-black/70 bg-surface-2 p-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.05),inset_0_-4px_0_rgb(0_0_0/0.4),0_2px_0_rgb(0_0_0/0.4)]">
              <Image
                src={
                  member.useskin === false
                    ? "/skins/blank.png"
                    : `/skins/${member.minecraftUser}.png`
                }
                alt={`Skin von ${member.minecraftUser}`}
                width={600}
                height={800}
                sizes="(min-width: 768px) 224px, 160px"
                className="h-auto w-40 rounded-[1px] object-contain md:w-56"
              />
            </div>

            <div className="w-full text-center md:text-left">
              <div className="mb-3 flex flex-wrap justify-center gap-1.5 md:justify-start">
              {roles.map((role) => (
                <MinecraftBadge key={role} variant={roleVariant(role)}>
                  {role}
                </MinecraftBadge>
              ))}
            </div>
              <h1 className="font-pixel text-3xl uppercase leading-tight text-foreground md:text-5xl">
                {member.name}
              </h1>

              {profile.level && (
                <p className="mt-4 flex items-center justify-center gap-2 border-b border-white/5 pb-4 text-sm md:justify-start">
                  <Gamepad2 className="size-4 text-muted" aria-hidden="true" />
                  <span className="text-muted">InGame-Level:</span>
                  <span className="font-bold text-emerald">
                    {profile.level}
                  </span>
                </p>
              )}

              {hasHeaderStats && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/5 pt-4 md:justify-start">
                  {profile.playTime && (
                    <HeaderStat
                      icon={<Clock className="size-4" aria-hidden="true" />}
                      value={profile.playTime}
                      label="Spielzeit"
                    />
                  )}
                  {profile.lastSeen && (
                    <HeaderStat
                      icon={<Eye className="size-4" aria-hidden="true" />}
                      value={profile.lastSeen}
                      label="Zuletzt gesehen"
                    />
                  )}
                  {profile.coins && (
                    <HeaderStat
                      icon={<Coins className="size-4" aria-hidden="true" />}
                      value={profile.coins}
                      label="Münzen"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-10">
          {profile.categories.length > 0 || profile.achievements ? (
            <Suspense fallback={null}>
              <CrewDetailTabs
                categories={profile.categories}
                achievements={profile.achievements ?? null}
              />
            </Suspense>
          ) : (
            <div className="mx-auto max-w-2xl rounded-block border border-dashed border-black/50 bg-surface-3/60 px-6 py-12 text-center">
              <Image
                src="/textures/barrier.png"
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                className="mx-auto mb-5 size-8 object-contain"
              />
              <p className="font-pixel text-base uppercase tracking-wide text-foreground md:text-lg">
                Keine erweiterten Statistiken verfügbar
              </p>
              <p className="mt-3 text-sm text-muted">
                Für dieses Mitglied konnten aktuell keine Statistiken gefunden
                werden. Schau später noch einmal vorbei.
              </p>
            </div>
          )}
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
