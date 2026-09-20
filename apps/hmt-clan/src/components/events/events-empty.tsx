import Image from "next/image";

type EventsEmptyProps = {
  title?: string;
  description?: string;
};

export default function EventsEmpty({
  title = "Keine Events veröffentlicht",
  description = "Aktuell sind keine Events veröffentlicht. Es sind aber bestimmt bereits welche in Planung – schau später noch einmal vorbei.",
}: EventsEmptyProps) {
  return (
    <div className="relative mx-auto max-w-xl rounded-block border-2 border-black/60 shadow-lift">
      <span
        aria-hidden="true"
        className="absolute -top-1.5 left-8 h-3 w-5 border border-black/60 bg-dirt-dark/70"
      />
      <span
        aria-hidden="true"
        className="absolute -top-1.5 right-8 h-3 w-5 border border-black/60 bg-dirt-dark/70"
      />
      <div className="texture texture-planks tex-24 relative overflow-hidden rounded-[1px] px-6 py-10 text-center md:py-14">
        <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
        <div className="relative">
          <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),inset_0_-3px_0_rgb(0_0_0/0.4),0_2px_0_rgb(0_0_0/0.5)]">
            <Image
              src="/textures/clock.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="size-6 object-contain"
            />
          </span>
          <p className="font-pixel text-base text-[#f3ecd9] drop-shadow-[0_2px_0_rgb(0_0_0/0.4)] md:text-xl">
            {title}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#f3ecd9]/70">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
