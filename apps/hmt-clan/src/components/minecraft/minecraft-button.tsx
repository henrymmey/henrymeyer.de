import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "stone" | "ghost";

const baseClasses =
  "inline-flex select-none items-center justify-center gap-2 rounded-[2px] font-pixel text-xs uppercase tracking-[0.08em] transition-all duration-150 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald disabled:pointer-events-none disabled:opacity-50 md:text-sm";

const variantClasses: Record<Variant, string> = {
  primary:
    "border border-grass-deep/70 bg-grass px-5 py-2.5 text-night shadow-[0_3px_0_0_var(--hmt-grass-deep)] hover:-translate-y-px hover:shadow-[0_4px_0_0_var(--hmt-grass-deep)] hover:brightness-110 active:translate-y-px active:shadow-[0_1px_0_0_var(--hmt-grass-deep)]",
  stone:
    "border border-black/50 bg-surface-3 px-5 py-2.5 text-foreground shadow-[0_3px_0_0_rgb(0_0_0/0.55)] hover:-translate-y-px hover:bg-surface-hover hover:shadow-[0_4px_0_0_rgb(0_0_0/0.55)] active:translate-y-px active:shadow-[0_1px_0_0_rgb(0_0_0/0.55)]",
  ghost:
    "border border-border bg-secondary-background/80 px-4 py-2 text-muted shadow-[0_2px_0_0_rgb(0_0_0/0.4)] backdrop-blur-sm hover:-translate-y-px hover:border-border hover:text-foreground active:translate-y-px active:shadow-none",
};

const sizeClasses = {
  sm: "px-3.5 py-1.5 text-[10px]",
  md: "px-4 py-2",
  lg: "px-6 py-3",
} as const;

export type MinecraftButtonProps = {
  href?: string;
  external?: boolean;
  variant?: Variant;
  size?: keyof typeof sizeClasses;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function MinecraftButton({
  href,
  external = false,
  variant = "stone",
  size = "md",
  className,
  children,
  ariaLabel,
  onClick,
  type = "button",
  disabled,
}: MinecraftButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    const isExternal = external || href.startsWith("http");
    const linkProps = isExternal
      ? { target: "_blank", rel: "noreferrer noopener" }
      : {};

    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}