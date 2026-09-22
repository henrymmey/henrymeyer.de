import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import CrewOverview, {
  type CrewSearchCard,
} from "@/components/crew/crew-overview";
import CrewCard from "@/components/crew/crew-card";
import { crew, getMemberRoles } from "@/lib/crew";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crew | HMT Clan",
  description:
    "Alle Mitglieder des HMT Clans auf einen Blick – mit Suche nach Spielernamen, Rolle und Minecraft-Namen.",
};

export default function CrewPage() {
  const members = [...crew].sort((a, b) => a.priority - b.priority);

  const active = members.filter((member) => !member.inactive);
  const inactive = members.filter((member) => member.inactive);

  const cards: CrewSearchCard[] = active.map((member) => ({
    key: member.minecraftUser,
    searchText:
      `${member.name} ${getMemberRoles(member).join(" ")} ${member.minecraftUser}`.toLowerCase(),
    node: <CrewCard member={member} />,
  }));

  const inactiveCards: CrewSearchCard[] = inactive.map((member) => ({
    key: member.minecraftUser,
    searchText:
      `${member.name} ${getMemberRoles(member).join(" ")} ${member.minecraftUser}`.toLowerCase(),
    node: <CrewCard member={member} />,
  }));

  return (
    <main>
      <CrewOverview cards={cards} inactiveCards={inactiveCards} />
      <SiteFooter />
    </main>
  );
}
