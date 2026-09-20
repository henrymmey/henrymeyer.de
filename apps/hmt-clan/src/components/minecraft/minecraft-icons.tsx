import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

function Frame({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

const dark = "rgb(0 0 0 / 0.28)";

export function GrassBlockIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect width="16" height="16" fill="var(--hmt-dirt)" />
      <rect y="0" width="16" height="5" fill="var(--hmt-grass)" />
      <rect x="1" y="11" width="3" height="2" fill={dark} />
      <rect x="9" y="8" width="3" height="2" fill={dark} />
      <rect x="4" y="13" width="2" height="1" fill="rgb(255 255 255 / 0.14)" />
    </Frame>
  );
}

export function DirtIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect width="16" height="16" fill="var(--hmt-dirt)" />
      <rect x="2" y="3" width="3" height="2" fill={dark} />
      <rect x="9" y="2" width="2" height="2" fill="rgb(255 255 255 / 0.12)" />
      <rect x="11" y="7" width="3" height="2" fill={dark} />
      <rect x="3" y="10" width="3" height="2" fill={dark} />
      <rect x="8" y="12" width="2" height="2" fill="rgb(255 255 255 / 0.1)" />
    </Frame>
  );
}

export function StoneIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect width="16" height="16" fill="var(--hmt-stone)" />
      <rect x="2" y="2" width="4" height="3" fill="rgb(0 0 0 / 0.16)" />
      <rect x="10" y="3" width="4" height="3" fill="rgb(255 255 255 / 0.12)" />
      <rect x="4" y="9" width="3" height="2" fill="rgb(0 0 0 / 0.16)" />
      <rect x="11" y="11" width="3" height="3" fill="rgb(0 0 0 / 0.1)" />
    </Frame>
  );
}

export function PlanksIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect width="16" height="16" fill="var(--hmt-planks)" />
      <rect x="0" y="7" width="16" height="2" fill="rgb(0 0 0 / 0.4)" />
      <rect x="0" y="0" width="2" height="7" fill="rgb(0 0 0 / 0.35)" />
      <rect x="8" y="9" width="2" height="7" fill="rgb(0 0 0 / 0.35)" />
      <rect x="3" y="2" width="3" height="2" fill="rgb(255 255 255 / 0.1)" />
    </Frame>
  );
}

export function SandIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect width="16" height="16" fill="var(--hmt-sand)" />
      <rect x="2" y="3" width="3" height="2" fill={dark} />
      <rect x="9" y="2" width="2" height="2" fill="rgb(255 255 255 / 0.14)" />
      <rect x="11" y="8" width="3" height="2" fill={dark} />
      <rect x="4" y="11" width="2" height="2" fill={dark} />
    </Frame>
  );
}

export function RedstoneIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect width="16" height="16" fill="var(--hmt-redstone)" />
      <rect x="1" y="1" width="14" height="14" fill="none" stroke="rgb(0 0 0 / 0.25)" />
      <rect x="4" y="4" width="3" height="2" fill="rgb(0 0 0 / 0.18)" />
      <rect x="10" y="6" width="2" height="2" fill="rgb(255 255 255 / 0.2)" />
      <rect x="6" y="10" width="3" height="2" fill="rgb(0 0 0 / 0.15)" />
    </Frame>
  );
}

export function ChestIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="2" y="3" width="12" height="10" fill="var(--hmt-planks)" />
      <rect x="2" y="8" width="12" height="5" fill="var(--hmt-planks-dark)" />
      <rect x="2" y="3" width="12" height="1" fill="rgb(0 0 0 / 0.35)" />
      <rect x="7" y="7" width="2" height="2" fill="var(--hmt-stone-light)" />
      <rect x="3" y="5" width="2" height="1" fill="rgb(255 255 255 / 0.14)" />
    </Frame>
  );
}

export function CraftingTableIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect width="16" height="16" fill="var(--hmt-planks)" />
      <rect x="1" y="1" width="14" height="14" fill="none" stroke="var(--hmt-planks-dark)" />
      <rect x="2" y="2" width="6" height="6" fill="#d9c599" />
      <rect x="8" y="2" width="6" height="6" fill="#c3a878" />
      <rect x="2" y="8" width="6" height="6" fill="#c3a878" />
      <rect x="8" y="8" width="6" height="6" fill="#d9c599" />
      <rect x="8" y="2" width="1" height="6" fill="rgb(0 0 0 / 0.25)" />
      <rect x="2" y="8" width="6" height="1" fill="rgb(0 0 0 / 0.25)" />
    </Frame>
  );
}

export function PickaxeIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="7" y="4" width="2" height="11" fill="#7d7468" />
      <rect x="4" y="2" width="8" height="3" fill="#e0e3d8" />
      <rect x="3" y="3" width="3" height="2" fill="#c8cdbf" />
      <rect x="8" y="13" width="2" height="2" fill="#5d564b" />
    </Frame>
  );
}

export function SwordIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="7" y="1" width="2" height="9" fill="#e4e7dc" />
      <rect x="7" y="1" width="2" height="3" fill="#ffffff" opacity="0.4" />
      <rect x="5" y="10" width="6" height="2" fill="#4c3a28" />
      <rect x="7" y="12" width="2" height="3" fill="#6f5434" />
      <rect x="7" y="14" width="2" height="1" fill="#4c3a28" />
    </Frame>
  );
}

export function MapIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="4" y="1" width="9" height="14" fill="var(--hmt-sand)" />
      <rect x="4" y="12" width="9" height="3" fill="#c4b27c" />
      <rect x="4" y="1" width="1" height="14" fill="rgb(0 0 0 / 0.25)" />
      <rect x="8" y="4" width="1" height="1" fill="#6f9c4d" />
      <rect x="11" y="9" width="1" height="1" fill="#6f9c4d" />
      <rect x="6" y="7" width="2" height="2" fill="var(--hmt-redstone)" />
    </Frame>
  );
}

export function EnderPearlIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="4" y="3" width="8" height="9" fill="#26202e" />
      <rect x="4" y="3" width="8" height="3" fill="#3a3148" />
      <rect x="6" y="6" width="2" height="2" fill="#59d2c1" />
      <rect x="9" y="5" width="1" height="1" fill="#9ef2e5" />
      <rect x="8" y="9" width="1" height="1" fill="#8a7fa0" />
    </Frame>
  );
}

export function EmeraldIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="2" y="4" width="12" height="10" fill="var(--hmt-emerald)" />
      <rect x="2" y="4" width="12" height="2" fill="#7af0a8" opacity="0.7" />
      <rect x="2" y="4" width="1" height="10" fill="rgb(0 0 0 / 0.25)" />
      <rect x="6" y="7" width="2" height="2" fill="rgb(0 0 0 / 0.14)" />
    </Frame>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="3" y="2" width="4" height="4" fill="#ef3f3f" />
      <rect x="9" y="2" width="4" height="4" fill="#ef3f3f" />
      <rect x="1" y="4" width="2" height="6" fill="#ef3f3f" />
      <rect x="13" y="4" width="2" height="6" fill="#ef3f3f" />
      <rect x="3" y="6" width="10" height="4" fill="#ef3f3f" />
      <rect x="5" y="9" width="6" height="2" fill="#ef3f3f" />
      <rect x="7" y="10" width="2" height="2" fill="#ef3f3f" />
    </Frame>
  );
}

export type MaterialIconName =
  | "grass"
  | "dirt"
  | "stone"
  | "planks"
  | "sand"
  | "redstone"
  | "chest"
  | "crafting-table"
  | "pickaxe"
  | "sword"
  | "map"
  | "ender-pearl"
  | "emerald"
  | "heart";

export const materialIcons: Record<MaterialIconName, (p: IconProps) => React.ReactNode> = {
  grass: GrassBlockIcon,
  dirt: DirtIcon,
  stone: StoneIcon,
  planks: PlanksIcon,
  sand: SandIcon,
  redstone: RedstoneIcon,
  chest: ChestIcon,
  "crafting-table": CraftingTableIcon,
  pickaxe: PickaxeIcon,
  sword: SwordIcon,
  map: MapIcon,
  "ender-pearl": EnderPearlIcon,
  emerald: EmeraldIcon,
  heart: HeartIcon,
};

export function MaterialIcon({
  name,
  className,
}: {
  name: MaterialIconName;
  className?: string;
}) {
  const Icon = materialIcons[name];
  return <Icon className={className} />;
}