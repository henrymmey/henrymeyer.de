export interface EventLink {
  displayName: string;
  url: string;
}

export type EventIconName =
  | "chest"
  | "sword"
  | "map"
  | "pickaxe"
  | "emerald"
  | "redstone"
  | "ender-pearl"
  | "grass"
  | "crafting-table";

export type EventIcon = EventIconName | `/${string}`;

export interface EventConfig {
  name: string;
  slug: string;
  description: string;
  priority: number;
  date: string;
  time?: string;
  showTime: boolean;
  show: boolean;
  showDetailsButton: boolean;
  done: boolean;
  icon?: EventIcon;
  links?: EventLink[];
  /** Season-Slug, falls das Event einer Season zugeordnet ist. */
  season?: string;
}