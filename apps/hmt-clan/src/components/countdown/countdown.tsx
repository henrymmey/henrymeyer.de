"use client";

import { useEffect, useState } from "react";
import PixelHeading from "@/components/minecraft/pixel-heading";
import Reveal from "@/components/minecraft/reveal";

const TARGET_TIMESTAMP = Date.UTC(2026, 9, 2, 18, 0, 0);
const TARGET_LABEL = "02.10.2026 · 20:00 Uhr";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
};

function getRemaining(now: number): Remaining | "reached" {
  const diff = TARGET_TIMESTAMP - now;
  if (diff <= 0) return "reached";
  const totalMinutes = Math.floor(diff / 60000);
  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

const pad = (value: number) => value.toString().padStart(2, "0");

function Slot({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 px-2 py-5 shadow-[inset_0_2px_0_rgb(255_255_255/0.05),inset_0_-4px_0_rgb(0_0_0/0.42),0_2px_0_rgb(0_0_0/0.4)] transition-transform duration-200 hover:-translate-y-0.5 md:py-8">
      <span className="font-pixel text-4xl tabular-nums text-emerald drop-shadow-[0_2px_0_rgb(0_0_0/0.5)] md:text-6xl">
        {value}
      </span>
      <span className="mt-2 font-pixel text-[9px] uppercase tracking-[0.24em] text-muted md:mt-3 md:text-[11px]">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-block shadow-[inset_0_0_0_1px_rgb(255_255_255/0.03)]"
      />
    </div>
  );
}

export default function Countdown() {
  const [remaining, setRemaining] = useState<Remaining | "reached" | "pending">(
    "pending",
  );

  useEffect(() => {
    const update = () => setRemaining(getRemaining(Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const isReached = remaining === "reached";

  return (
    <section
      id="countdown"
      aria-label="Countdown zum nächsten Event"
      className="mx-auto w-full max-w-3xl px-4 py-16 md:py-24"
    >
      <Reveal>
        <div className="overflow-hidden rounded-block border border-black/60 shadow-lift">
          <div className="texture texture-planks tex-24 relative border-b-2 border-black/50 bg-black/10 px-5 py-7 text-center md:py-9">
            <PixelHeading
              as="h2"
              className="text-2xl text-[#efe8d8] drop-shadow-[0_2px_0_rgb(0_0_0/0.45)] md:text-4xl"
            >
              Bald geht&apos;s los
            </PixelHeading>
            <p className="mt-3 text-xs font-medium tracking-wide text-[#f5f0e4] drop-shadow-[0_1px_0_rgb(0_0_0/0.6)] md:text-sm">
              {TARGET_LABEL}
            </p>
          </div>

          <div className="bg-surface-2 px-4 py-8 md:px-8 md:py-10">
            {isReached ? (
              <p className="text-center font-pixel text-xl text-emerald drop-shadow-[0_2px_0_rgb(0_0_0/0.5)] md:text-2xl">
                Das Event hat begonnen!
              </p>
            ) : (
              <div className="mx-auto grid max-w-md grid-cols-3 gap-2.5 md:max-w-xl md:gap-4">
                <Slot
                  value={remaining === "pending" ? "--" : pad(remaining.days)}
                  label="Tage"
                />
                <Slot
                  value={remaining === "pending" ? "--" : pad(remaining.hours)}
                  label="Stunden"
                />
                <Slot
                  value={
                    remaining === "pending" ? "--" : pad(remaining.minutes)
                  }
                  label="Minuten"
                />
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
