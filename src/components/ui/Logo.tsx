import { cn } from "../../lib/utils";

export function Logo({ size = 36, withText = true, className }: { size?: number; withText?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="overflow-hidden rounded-xl ring-1 ring-slate-200 shadow-soft dark:ring-slate-700"
        style={{ width: size, height: size }}
      >
        <img src="/logo.jpg" alt="Skill Aura" className="h-full w-full object-cover" />
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-tight">
            Skill <span className="text-gradient">Aura</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">Trade time, learn anything</span>
        </div>
      )}
    </div>
  );
}
