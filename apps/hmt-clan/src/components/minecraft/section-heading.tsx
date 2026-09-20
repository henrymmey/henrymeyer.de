import { cn } from "@/lib/utils";
import PixelHeading from "@/components/minecraft/pixel-heading";

type SectionHeadingProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <PixelHeading as="h2" className="text-2xl text-foreground md:text-4xl">
        {title}
      </PixelHeading>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}