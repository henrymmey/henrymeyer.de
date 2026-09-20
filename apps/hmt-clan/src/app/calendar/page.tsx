import CalendarWidget from "@/components/calendar/calendar-widget";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender | HMT Clan",
  description: "Der Event-Kalender von HMT Clan.",
};

export default function CalendarPage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col px-2 pt-[61px]">
      <CalendarWidget fill />
    </main>
  );
}