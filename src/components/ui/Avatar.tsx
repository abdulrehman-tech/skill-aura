import { cn, initials } from "../../lib/utils";

export function Avatar({
  src,
  name,
  size = 40,
  className,
  ring,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full text-white font-semibold",
        src ? "bg-slate-100 dark:bg-slate-800" : "bg-aura-gradient",
        ring && "ring-2 ring-white shadow-soft dark:ring-slate-900",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
