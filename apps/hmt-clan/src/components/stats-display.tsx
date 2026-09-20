import { Clock, Coins, Gamepad2 } from "lucide-react";
import { getThescapeStats } from "@/lib/thescape";

interface StatsDisplayProps {
  slug?: string;
}

export default async function StatsDisplay({ slug }: StatsDisplayProps) {
  if (!slug || slug.trim().length === 0) {
    return null;
  }

  const stats = await getThescapeStats(slug);

  const showLevel = Boolean(stats.level);
  const showPlayTime = Boolean(stats.playTime);
  const showCoins = Boolean(stats.coins);

  if (!showLevel && !showPlayTime && !showCoins) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center justify-center gap-x-3 gap-y-1 text-xs text-muted">
      {showLevel && stats.level && (
        <span className="flex items-center gap-1">
          <Gamepad2 className="size-3.5" aria-hidden="true" />
          Level {stats.level}
        </span>
      )}
      {showPlayTime && stats.playTime && (
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden="true" />
          {stats.playTime}
        </span>
      )}
      {showCoins && stats.coins && (
        <span className="flex items-center gap-1">
          <Coins className="size-3.5" aria-hidden="true" />
          {stats.coins}
        </span>
      )}
    </div>
  );
}