import { Clock } from "lucide-react";
import { cn } from "../../lib/utils";

export function CreditPill({ credits, className }: { credits: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-aura-gradient px-3 py-1.5 text-sm font-semibold text-white shadow-soft", className)}>
      <Clock size={14} />
      {credits}
      <span className="text-xs font-normal opacity-80">credits</span>
    </span>
  );
}
