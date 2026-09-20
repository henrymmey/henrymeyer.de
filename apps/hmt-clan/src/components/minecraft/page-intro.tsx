import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import PixelHeading from "@/components/minecraft/pixel-heading";
import type { MaterialIconName } from "@/components/minecraft/minecraft-icons";

type PageIntroProps = {
  eyebrow?: React.ReactNode;
  eyebrowIcon?: MaterialIconName;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export default function PageIntro({
  eyebrow,
  eyebrowIcon,
  title,
  description,
}: PageIntroProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-8 md:pt-10">
      <div className="max-w-3xl">
        {eyebrow && (
          <MinecraftBadge variant="grass" icon={eyebrowIcon} className="mb-4">
            {eyebrow}
          </MinecraftBadge>
        )}
        <PixelHeading as="h1" className="text-3xl text-foreground md:text-5xl">
          {title}
        </PixelHeading>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      <div
        aria-hidden="true"
        className="mt-8 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"
      />
    </section>
  );
}