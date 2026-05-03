import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Award, GraduationCap, Sparkles, Star, TrendingUp, Trophy } from "lucide-react";
import { store } from "../lib/store";
import { Avatar } from "../components/ui/Avatar";
import { LevelBadge } from "../components/ui/Badge";
import { RatingStars } from "../components/ui/RatingStars";
import { categories } from "../data/categories";
import { cn } from "../lib/utils";
import { useTranslation } from "../i18n";
import type { User, Category } from "../lib/types";

type Tab = "teachers" | "learners" | "rated";

const tabConfig: Record<
  Tab,
  { icon: typeof Trophy; metric: (u: User) => number; suffixKey: string }
> = {
  teachers: {
    icon: GraduationCap,
    metric: (u) => u.hoursTaught,
    suffixKey: "leaderboard.suffix.hrsTaught",
  },
  learners: {
    icon: TrendingUp,
    metric: (u) => u.hoursLearned,
    suffixKey: "leaderboard.suffix.hrsLearned",
  },
  rated: {
    icon: Star,
    metric: (u) => u.rating,
    suffixKey: "leaderboard.suffix.rating",
  },
};

const countryFlag: Record<string, string> = {
  Oman: "🇴🇲",
  Italy: "🇮🇹",
  Pakistan: "🇵🇰",
  Japan: "🇯🇵",
  Portugal: "🇵🇹",
  "South Korea": "🇰🇷",
  Morocco: "🇲🇦",
  Brazil: "🇧🇷",
  Germany: "🇩🇪",
  India: "🇮🇳",
  France: "🇫🇷",
  Egypt: "🇪🇬",
};

const podiumStyles: { ring: string; gradient: string; medal: string; size: number }[] = [
  // index 0 = silver (left, 2nd)
  {
    ring: "ring-slate-300",
    gradient: "from-slate-300 via-slate-200 to-slate-100",
    medal: "🥈",
    size: 80,
  },
  // index 1 = gold (center, 1st)
  {
    ring: "ring-amber-400",
    gradient: "from-amber-300 via-amber-200 to-yellow-100",
    medal: "🥇",
    size: 104,
  },
  // index 2 = bronze (right, 3rd)
  {
    ring: "ring-orange-400",
    gradient: "from-orange-300 via-orange-200 to-amber-100",
    medal: "🥉",
    size: 80,
  },
];

function formatMetric(tab: Tab, value: number): string {
  if (tab === "rated") return value.toFixed(2);
  return String(value);
}

const tabKeyMap: Record<Tab, string> = {
  teachers: "leaderboard.tabs.teachers",
  learners: "leaderboard.tabs.learners",
  rated: "leaderboard.tabs.rated",
};

export function Leaderboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("teachers");
  const [filter, setFilter] = useState<Category | "All">("All");

  const allUsers = useMemo(() => store.getUsers(), []);
  const ranked = useMemo(() => {
    const cfg = tabConfig[tab];
    return [...allUsers]
      .sort((a, b) => cfg.metric(b) - cfg.metric(a))
      .slice(0, 12);
  }, [allUsers, tab]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  // Reorder for podium visual: silver / gold / bronze
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean) as User[];

  const cfg = tabConfig[tab];
  const TabIcon = cfg.icon;
  const suffixText = t(cfg.suffixKey);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <header className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-aura-soft px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <Trophy size={12} /> {t("leaderboard.badge")}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient">{t("leaderboard.titlePrefix")}</span>{" "}
            {t("leaderboard.titleSuffix")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("leaderboard.subtitle")}
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label={t("leaderboard.tabsLabel")}
        className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft dark:border-slate-800 dark:bg-slate-900"
      >
        {(Object.keys(tabConfig) as Tab[]).map((tabKey) => {
          const active = tab === tabKey;
          const Icon = tabConfig[tabKey].icon;
          return (
            <button
              key={tabKey}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(tabKey)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition sm:flex-none",
                active
                  ? "bg-aura-gradient text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Icon size={15} />
              {t(tabKeyMap[tabKey])}
            </button>
          );
        })}
      </div>

      {/* Filter chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t("leaderboard.filter.label")}
        </span>
        <button
          type="button"
          onClick={() => setFilter("All")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition",
            filter === "All"
              ? "bg-aura-gradient text-white shadow-soft"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          )}
        >
          {t("leaderboard.filter.all")}
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setFilter(c.name)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition",
              filter === c.name
                ? "bg-aura-gradient text-white shadow-soft"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            <span aria-hidden>{c.emoji}</span>
            {t(`categories.${c.name}`)}
          </button>
        ))}
      </div>

      {/* Podium */}
      {podium.length > 0 && (
        <section
          aria-label={t("leaderboard.podium.ariaLabel")}
          className="mt-8 grid grid-cols-3 items-end gap-3 sm:gap-6"
        >
          {podium.map((u, i) => {
            const cfgPod = podiumStyles[i];
            const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const value = formatMetric(tab, cfg.metric(u));
            return (
              <Link
                key={u.id}
                to={`/profile/${u.id}`}
                className={cn(
                  "group relative flex flex-col items-center rounded-2xl border border-slate-200 bg-gradient-to-b p-4 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-glow dark:border-slate-800 sm:p-6",
                  cfgPod.gradient
                )}
                style={{
                  paddingTop: i === 1 ? "1.5rem" : "1rem",
                  paddingBottom: i === 1 ? "2rem" : "1.5rem",
                }}
              >
                <span
                  className="absolute -top-3 end-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-soft dark:bg-slate-900 dark:text-slate-200"
                  aria-label={t("leaderboard.podium.rankAria", { rank: realRank })}
                >
                  #{realRank}
                </span>
                <span className="text-2xl sm:text-3xl" aria-hidden>
                  {cfgPod.medal}
                </span>
                <div className="mt-2">
                  <Avatar
                    src={u.avatar}
                    name={u.name}
                    size={cfgPod.size}
                    ring
                    className={cn("ring-4", cfgPod.ring)}
                  />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 sm:text-base">
                  {u.name}
                </h3>
                <p className="text-xs text-slate-700">
                  <span aria-hidden className="me-1">
                    {countryFlag[u.country] ?? "🌐"}
                  </span>
                  <span lang="en">{u.country}</span>
                </p>
                <p className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {value}
                  <span className="ms-1 text-xs font-medium text-slate-700">
                    {suffixText}
                  </span>
                </p>
              </Link>
            );
          })}
        </section>
      )}

      {/* Rest of list */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="hidden grid-cols-12 gap-3 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:grid">
          <div className="col-span-1">{t("leaderboard.table.rank")}</div>
          <div className="col-span-5">{t("leaderboard.table.member")}</div>
          <div className="col-span-2">{t("leaderboard.table.country")}</div>
          <div className="col-span-2">{suffixText}</div>
          <div className="col-span-2 text-end">{t("leaderboard.table.rating")}</div>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {rest.map((u, i) => {
            const rank = i + 4;
            const value = formatMetric(tab, cfg.metric(u));
            return (
              <li
                key={u.id}
                className="grid grid-cols-12 items-center gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="col-span-2 sm:col-span-1">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {rank}
                  </span>
                </div>
                <div className="col-span-7 flex items-center gap-3 sm:col-span-5">
                  <Avatar src={u.avatar} name={u.name} size={40} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{u.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      {u.badges.slice(0, 1).map((b) => (
                        <LevelBadge key={b} level={b} />
                      ))}
                      {u.verified && (
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          {t("leaderboard.table.verified")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 hidden items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2 sm:flex">
                  <span aria-hidden>{countryFlag[u.country] ?? "🌐"}</span>
                  <span className="truncate" lang="en">{u.country}</span>
                </div>
                <div className="col-span-2 hidden items-center gap-1.5 text-sm font-semibold sm:flex">
                  <TabIcon size={14} className="text-brand-500" />
                  {value}
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2 sm:col-span-2">
                  <span className="hidden sm:block">
                    <RatingStars value={u.rating} size={12} />
                  </span>
                  <Link
                    to={`/profile/${u.id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    {t("leaderboard.table.view")}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Footer note */}
      <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-aura-teal/10 via-aura-indigo/10 to-aura-violet/10 p-5 text-center shadow-soft dark:border-slate-800 sm:flex-row sm:text-start">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-aura-gradient text-white shadow-soft">
            <Award size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold">{t("leaderboard.cta.title")}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("leaderboard.cta.subtitle")}
            </p>
          </div>
        </div>
        <Link to="/browse" className="btn-primary">
          <Sparkles size={16} /> {t("leaderboard.cta.button")}
        </Link>
      </div>
    </div>
  );
}

export default Leaderboard;
