import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import MinecraftButton from "@/components/minecraft/minecraft-button";
import { MaterialIcon } from "@/components/minecraft/minecraft-icons";
import { getEventMaterialIcon } from "@/components/events/event-material";
import type { EventConfig } from "@/lib/events/types";

function formatDate(event: EventConfig): string {
  const date = new Date(event.date + "T00:00:00").toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return event.showTime && event.time ? `${date} · ${event.time} Uhr` : date;
}

export default function EventCard({ event }: { event: EventConfig }) {
  const icon = getEventMaterialIcon(event);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="texture texture-planks tex-24 relative border-b-2 border-black/50 bg-black/10 px-4 py-3">
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <span className="font-pixel text-[10px] font-medium uppercase tracking-[0.08em] text-[#f5f0e4] drop-shadow-[0_1px_0_rgb(0_0_0/0.6)]">
            {formatDate(event)}
          </span>
          {event.done && (
            <MinecraftBadge variant="redstone" icon="heart">
              Vorbei
            </MinecraftBadge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-4 flex size-11 items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.05),inset_0_-3px_0_rgb(0_0_0/0.4),0_2px_0_rgb(0_0_0/0.4)]">
          <MaterialIcon name={icon} className="size-6" />
        </span>

        <h3 className="font-pixel text-lg leading-snug text-main-foreground">
          {event.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
          {event.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
            {event.showDetailsButton && (
              <MinecraftButton href={`/events/${event.slug}`} variant="stone" size="sm">
                Details
              </MinecraftButton>
            )}
            {event.links?.map((link) => (
              <MinecraftButton
                key={link.url}
                href={link.url}
                external
                variant="stone"
                size="sm"
              >
                {link.displayName}
              </MinecraftButton>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}