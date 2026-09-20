import { cn } from "@/lib/utils";

type BlockFrameProps = {
  header?: React.ReactNode;
  headerTexture?: "planks" | "stone" | "dirt" | "none";
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

const headerTextureClasses: Record<NonNullable<BlockFrameProps["headerTexture"]>, string> = {
  planks: "texture texture-planks tex-24 bg-black/10",
  stone: "texture texture-stone tex-24 bg-black/10",
  dirt: "texture texture-dirt tex-24 bg-black/10",
  none: "bg-surface-2",
};

export default function BlockFrame({
  header,
  headerTexture = "planks",
  className,
  bodyClassName,
  children,
}: BlockFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card",
        className,
      )}
    >
      {header ? (
        <div
          className={cn(
            "relative border-b-2 border-black/50 px-4 py-3",
            headerTextureClasses[headerTexture],
          )}
        >
          <div className="relative flex items-center justify-between gap-3">
            {header}
          </div>
        </div>
      ) : null}
      <div className={cn(bodyClassName)}>{children}</div>
    </div>
  );
}