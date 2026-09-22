import Link from "next/link";

export default function CrewJoinCard() {
  return (
    <Link
      href="/join"
      className="group block h-full overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 bg-[linear-gradient(to_bottom,var(--hmt-surface-2),var(--hmt-surface))] px-5 text-center">
        <p className="font-pixel text-base uppercase tracking-[0.14em] text-main-foreground transition-colors duration-200 group-hover:text-grass">
          Du willst mitmachen?
        </p>
        <p className="text-sm leading-relaxed text-muted">
          Dann gucke hier vorbei und erfahre, wie du dem HMT Clan beitreten
          kannst.
        </p>
        <span className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-grass-deep/70 bg-grass px-4 py-2.5 font-pixel text-[10px] uppercase tracking-[0.08em] text-night shadow-[0_3px_0_0_var(--hmt-grass-deep)] transition-all duration-150 group-hover:-translate-y-px group-hover:brightness-110">
          Hier vorbeischauen
        </span>
      </div>

      <div className="relative border-t border-white/5 px-3 pb-4 pt-3 text-center">
        <p className="font-pixel text-[15px] leading-tight text-main-foreground transition-colors duration-200 group-hover:text-grass">
          Hier könnte dein Name stehen!
        </p>
      </div>
    </Link>
  );
}
