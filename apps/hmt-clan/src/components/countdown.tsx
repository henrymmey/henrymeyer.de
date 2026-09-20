"use client";

import { useEffect, useState } from "react";

const TARGET_TIMESTAMP = Date.UTC(2026, 9, 2, 18, 0, 0);

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

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-base border border-border/30 bg-secondary-background px-2 py-4 shadow-sm sm:gap-2 sm:py-6">
      <span className="font-heading text-3xl tabular-nums text-main-foreground sm:text-5xl">
        {value}
      </span>
      <span className="text-xs text-foreground/60 sm:text-sm">{label}</span>
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

  return (
    <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-center shadow-sm md:p-8">
      <h2 className="mb-2 text-2xl font-heading text-main-foreground sm:text-3xl">
        Bald ist es soweit!
      </h2>
      <p className="mb-6 text-sm text-foreground/60">02.10.2026 · 20:00 Uhr</p>

      {remaining === "reached" ? (
        <p className="font-heading text-xl text-main-foreground sm:text-2xl">
          Jetzt ist es soweit!
        </p>
      ) : (
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
          <Unit
            value={remaining === "pending" ? "--" : pad(remaining.days)}
            label="Tage"
          />
          <Unit
            value={remaining === "pending" ? "--" : pad(remaining.hours)}
            label="Stunden"
          />
          <Unit
            value={remaining === "pending" ? "--" : pad(remaining.minutes)}
            label="Minuten"
          />
        </div>
      )}
    </section>
  );
}
