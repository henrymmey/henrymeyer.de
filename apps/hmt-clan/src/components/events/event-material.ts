import type { MaterialIconName } from "@/components/minecraft/minecraft-icons";
import type { EventConfig, EventIcon } from "@/lib/events/types";

const iconMap: Record<EventIcon, MaterialIconName> = {
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

export function getEventMaterialIcon(event: Pick<EventConfig, "icon">): MaterialIconName {
  return iconMap[event.icon ?? "map"];
}