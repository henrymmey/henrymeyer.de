import { cn } from "@/lib/utils";

type PixelHeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  children: React.ReactNode;
};

export default function PixelHeading({
  as: Tag = "h2",
  className,
  children,
}: PixelHeadingProps) {
  return (
    <Tag
      className={cn(
        "font-pixel font-[700] uppercase leading-none tracking-[0.02em]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}