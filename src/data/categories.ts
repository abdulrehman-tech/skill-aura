import type { Category } from "../lib/types";

export const categories: { name: Category; emoji: string; color: string; count: number }[] = [
  { name: "Languages", emoji: "🌍", color: "from-sky-400 to-indigo-500", count: 38 },
  { name: "Design", emoji: "🎨", color: "from-fuchsia-400 to-pink-500", count: 22 },
  { name: "Cooking", emoji: "🍳", color: "from-orange-400 to-rose-500", count: 17 },
  { name: "Photography", emoji: "📸", color: "from-cyan-400 to-teal-500", count: 14 },
  { name: "Programming", emoji: "💻", color: "from-violet-500 to-indigo-600", count: 31 },
  { name: "Makeup", emoji: "💄", color: "from-pink-400 to-fuchsia-500", count: 9 },
  { name: "Academic", emoji: "🎓", color: "from-emerald-400 to-teal-500", count: 26 },
];
