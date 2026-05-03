import { cn } from "../../lib/utils";
import type { Level } from "../../lib/types";

const styles: Record<Level | "default", string> = {
  Beginner: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Intermediate: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  Expert: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  Pro: "bg-aura-gradient text-white",
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", styles[level] ?? styles.default, className)}>
      {level === "Pro" ? "★ " : ""}{level}
    </span>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("chip", className)}>{children}</span>;
}
