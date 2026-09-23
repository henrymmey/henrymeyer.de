import CalendarWidget from "@/components/calendar/calendar-widget";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender | HMT Clan",
  description:
    "Der Event-Kalender des HMT Clans: alle Termine rund um unser gemeinsames Minecraft-Spiel auf dem TheScape-Server auf einen Blick.",
  alternates: {
    canonical: "/calendar",
  },
};

export default function CalendarPage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col px-2 pt-[61px]">
      <CalendarWidget fill />
    </main>
  );
}