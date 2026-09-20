import { cn } from "@/lib/utils";
import { MaterialIcon, type MaterialIconName } from "@/components/minecraft/minecraft-icons";

type Variant = "stone" | "grass" | "redstone" | "planks";

const variantClasses: Record<Variant, string> = {
  stone: "border-black/40 bg-surface-3 text-muted",
  grass: "border-grass-deep bg-grass/15 text-grass",
  redstone: "border-redstone/50 bg-redstone/15 text-redstone",
  planks: "border-planks-dark/70 bg-planks/15 text-planks",
};

export type MinecraftBadgeProps = {
  variant?: Variant;
  icon?: MaterialIconName;
  className?: string;
  children: React.ReactNode;
};

export default function MinecraftBadge({
  variant = "stone",
  icon,
  className,
  children,
}: MinecraftBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-1 font-pixel text-[9px] uppercase tracking-[0.12em] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] md:text-[10px]",
        variantClasses[variant],
        className,
      )}
    >
      {icon && <MaterialIcon name={icon} className="size-3.5" />}
      {children}
    </span>
  );
}