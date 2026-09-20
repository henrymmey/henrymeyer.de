import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import CrewOverview, {
  type CrewSearchCard,
} from "@/components/crew/crew-overview";
import CrewCard from "@/components/crew/crew-card";
import { crew } from "@/lib/crew";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crew | HMT Clan",
  description:
    "Alle Mitglieder des HMT Clans auf einen Blick – mit Suche nach Spielernamen, Rolle und Minecraft-Namen.",
};

export default function CrewPage() {
  const members = [...crew].sort((a, b) => a.priority - b.priority);

  const cards: CrewSearchCard[] = members.map((member) => ({
    key: member.minecraftUser,
    searchText:
      `${member.name} ${member.rolle} ${member.minecraftUser}`.toLowerCase(),
    node: <CrewCard member={member} />,
  }));

  return (
    <main>
      <CrewOverview cards={cards} />
      <SiteFooter />
    </main>
  );
}
