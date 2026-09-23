import Image from "next/image";
import { cn } from "@/lib/utils";
import { MaterialIcon, type MaterialIconName } from "@/components/minecraft/minecraft-icons";
import type { EventIcon, EventIconName } from "@/lib/events/types";

const iconMap: Record<EventIconName, MaterialIconName> = {
  chest: "chest",
  sword: "sword",
  map: "map",
  pickaxe: "pickaxe",
  emerald: "emerald",
  redstone: "redstone",
  "ender-pearl": "ender-pearl",
  grass: "grass",
  "crafting-table": "crafting-table",
};

export function isEventIconName(icon: EventIcon | undefined): icon is EventIconName {
  return icon != null && icon in iconMap;
}

export function getEventIconImagePath(icon: EventIcon): string {
  return icon.startsWith("/events/") ? icon : `/events/${icon}`;
}

export function EventIconView({
  icon,
  className,
}: {
  icon?: EventIcon;
  className?: string;
}) {
  if (icon && !isEventIconName(icon)) {
    return (
      <span
        className={cn("relative inline-block select-none", className)}
      >
        <Image
          src={getEventIconImagePath(icon)}
          alt="Event-Symbol"
          width={128}
          height={128}
          className="size-full object-contain [image-rendering:pixelated]"
        />
      </span>
    );
  }

  return <MaterialIcon name={iconMap[icon ?? "map"]} className={className} />;
}