import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

export function RatingStars({ value, count, size = 14, className }: { value: number; count?: number; size?: number; className?: string }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              className={cn("transition", filled ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600")}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{value.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-xs text-slate-400">({count})</span>}
    </div>
  );
}
