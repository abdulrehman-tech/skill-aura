import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);
  const sign = diff < 0 ? "ago" : "in";
  if (abs < 60) return `${sign === "ago" ? "just now" : "soon"}`;
  if (abs < 3600) return `${sign} ${Math.round(abs / 60)}m`;
  if (abs < 86400) return `${sign} ${Math.round(abs / 3600)}h`;
  return `${sign} ${Math.round(abs / 86400)}d`;
}
