import { Link, Navigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Compass,
  Crown,
  GraduationCap,
  Pencil,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../hooks/useUser";
import { store } from "../lib/store";
import { getUser } from "../data/users";
import { getSkill } from "../data/skills";
import { Avatar } from "../components/ui/Avatar";
import { LevelBadge, Chip } from "../components/ui/Badge";
import { RatingStars } from "../components/ui/RatingStars";
import { CreditPill } from "../components/ui/CreditPill";
import { cn, formatDate, relativeTime } from "../lib/utils";
import { useTranslation } from "../i18n";
import type { Session } from "../lib/types";

const sessionTypeStyles: Record<Session["type"], string> = {
  private: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  group: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  cultural: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  children,
}: {
  icon: typeof Clock;
  label: string;
  value: React.ReactNode;
  accent: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card group relative overflow-hidden transition hover:-translate-y-0.5 hover:shadow-glow">
      <div
        aria-hidden
        className={cn(
          "absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40",
          accent
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
          {children && <div className="mt-2">{children}</div>}
        </div>
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-soft",
            accent
          )}
        >
          <Icon size={18} />
        </span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const user = useUser();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>(() => store.getSessions());
  const [skillTab, setSkillTab] = useState<"teaching" | "learning">("teaching");

  useEffect(() => {
    const handler = () => setSessions(store.getSessions());
    window.addEventListener("skillaura:sessions", handler);
    return () => window.removeEventListener("skillaura:sessions", handler);
  }, []);

  const upcomingSessions = useMemo(() => {
    if (!user) return [];
    return sessions
      .filter((s) => s.participants.includes(user.id) && s.status === "upcoming")
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [sessions, user]);

  const recentActivity = useMemo(() => {
    if (!user) return [];
    return sessions
      .filter((s) => s.participants.includes(user.id) && s.status === "completed")
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
      .slice(0, 5);
  }, [sessions, user]);

  if (!user) return <Navigate to="/login" replace />;

  const firstName = user.name.split(" ")[0];
  const skillIds = skillTab === "teaching" ? user.teaches : user.learning;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-aura-gradient p-6 text-white shadow-soft animate-fade-in sm:p-8">
        <img
          src="https://images.unsplash.com/photo-1582623888319-29bfe72bb7d3?auto=format&fit=crop&w=600&q=75"
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute inset-y-0 end-0 hidden h-full w-1/3 object-cover opacity-25 mix-blend-overlay md:block"
        />
        <div
          aria-hidden
          className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -start-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative z-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} name={user.name} size={64} ring />
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {t("dashboard.greeting", { name: firstName })}
              </h1>
              <p className="mt-1 text-sm text-white/85 sm:text-base">
                {t("dashboard.bannerSubtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/match"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <Sparkles size={16} className="-mt-0.5 me-1.5 inline" />
              {t("dashboard.findMatch")}
            </Link>
            <Link
              to="/sessions"
              className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"
            >
              {t("dashboard.mySessions")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <StatCard
          icon={Clock}
          label={t("dashboard.stats.creditsBalance")}
          value={user.credits}
          accent="bg-gradient-to-br from-aura-teal to-aura-sky"
        >
          <CreditPill credits={user.credits} className="!py-1 !text-xs" />
        </StatCard>
        <StatCard
          icon={GraduationCap}
          label={t("dashboard.stats.hoursTaught")}
          value={user.hoursTaught}
          accent="bg-gradient-to-br from-aura-indigo to-aura-violet"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t("dashboard.stats.lifetimeContribution")}
          </span>
        </StatCard>
        <StatCard
          icon={TrendingUp}
          label={t("dashboard.stats.hoursLearned")}
          value={user.hoursLearned}
          accent="bg-gradient-to-br from-aura-violet to-aura-orange"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t("dashboard.stats.keepGrowing")}
          </span>
        </StatCard>
        <StatCard
          icon={Star}
          label={t("dashboard.stats.rating")}
          value={user.rating.toFixed(2)}
          accent="bg-gradient-to-br from-amber-400 to-orange-500"
        >
          <RatingStars value={user.rating} count={user.reviews} />
        </StatCard>
      </section>

      {/* Achievement strip */}
      {(user.badges.length > 0 || user.verified) && (
        <section className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <span className="me-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("dashboard.achievements.title")}
          </span>
          {user.badges.map((b) => (
            <LevelBadge key={b} level={b} />
          ))}
          {user.verified && (
            <Chip className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              {t("dashboard.achievements.verified")}
            </Chip>
          )}
          {user.premium && (
            <Chip className="bg-aura-gradient text-white">
              <Crown size={12} /> {t("dashboard.achievements.premium")}
            </Chip>
          )}
          {user.hoursTaught >= 30 && <Chip>{t("dashboard.achievements.topMentor")}</Chip>}
          {user.hoursLearned >= 20 && <Chip>{t("dashboard.achievements.eagerLearner")}</Chip>}
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Upcoming sessions */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("dashboard.upcoming.title")}</h2>
            <Link
              to="/sessions"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              {t("dashboard.upcoming.viewAll")}
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-soft text-3xl">
                <span aria-hidden>📅</span>
              </div>
              <h3 className="text-base font-semibold">{t("dashboard.upcoming.emptyTitle")}</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                {t("dashboard.upcoming.emptyDescription")}
              </p>
              <Link to="/browse" className="btn-primary mt-4">
                <Compass size={16} /> {t("dashboard.upcoming.browseSkills")}
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcomingSessions.map((s) => {
                const skill = getSkill(s.skillId);
                const tutor = getUser(s.tutorId);
                const isTutor = s.tutorId === user.id;
                return (
                  <li
                    key={s.id}
                    className="card flex flex-col gap-4 transition hover:-translate-y-0.5 hover:shadow-glow sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      {tutor && (
                        <Avatar
                          src={tutor.avatar}
                          name={tutor.name}
                          size={48}
                          ring
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold">
                            {skill?.title ?? t("dashboard.upcoming.sessionFallback")}
                          </h3>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              sessionTypeStyles[s.type]
                            )}
                          >
                            {s.type}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                          {isTutor
                            ? t("dashboard.upcoming.youTeach")
                            : t("dashboard.upcoming.withTutor")}{" "}
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            {isTutor
                              ? ""
                              : tutor?.name ?? t("dashboard.upcoming.unknownTutor")}
                          </span>
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(s.startsAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} /> {s.durationHours}
                            {t("dashboard.upcoming.hourSuffix")}
                          </span>
                          <span className="font-medium text-brand-600 dark:text-brand-400">
                            {relativeTime(s.startsAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary shrink-0"
                      onClick={() =>
                        alert(
                          t("dashboard.upcoming.joinAlert", {
                            skill:
                              skill?.title ??
                              t("dashboard.upcoming.joinFallback"),
                          })
                        )
                      }
                    >
                      <Video size={16} /> {t("dashboard.upcoming.join")}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Recent activity */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">{t("dashboard.activity.title")}</h2>
            {recentActivity.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                {t("dashboard.activity.empty")}
              </p>
            ) : (
              <ol className="relative space-y-4 border-s-2 border-slate-200 ps-5 dark:border-slate-800">
                {recentActivity.map((s) => {
                  const skill = getSkill(s.skillId);
                  const taught = s.tutorId === user.id;
                  const other = getUser(taught ? s.learnerId : s.tutorId);
                  return (
                    <li key={s.id} className="relative">
                      <span
                        aria-hidden
                        className="absolute -start-[27px] top-1.5 h-3 w-3 rounded-full bg-aura-gradient ring-4 ring-white dark:ring-slate-950"
                      />
                      <div className="card !p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {taught
                                ? t("dashboard.activity.taught")
                                : t("dashboard.activity.learned")}{" "}
                            </span>
                            <span className="text-brand-600 dark:text-brand-400">
                              {skill?.title ?? t("dashboard.activity.skillFallback")}
                            </span>
                            {other && (
                              <>
                                {" "}
                                <span className="text-slate-500 dark:text-slate-400">
                                  {taught
                                    ? t("dashboard.activity.to")
                                    : t("dashboard.activity.with")}{" "}
                                  {other.name}
                                </span>
                              </>
                            )}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {relativeTime(s.startsAt)}
                          </span>
                        </div>
                        {typeof s.rating === "number" && (
                          <div className="mt-1.5">
                            <RatingStars value={s.rating} size={12} />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>

        {/* Sidebar: skills + quick actions */}
        <aside className="space-y-6">
          {/* Your skills */}
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("dashboard.skills.title")}</h2>
            </div>
            <div className="mt-3 inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {(["teaching", "learning"] as const).map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setSkillTab(tabKey)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                    skillTab === tabKey
                      ? "bg-white text-slate-900 shadow-soft dark:bg-slate-900 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                  )}
                >
                  {t(`dashboard.skills.tabs.${tabKey}`)}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillIds.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("dashboard.skills.empty")}{" "}
                  <Link
                    to="/browse"
                    className="font-medium text-brand-600 dark:text-brand-400"
                  >
                    {t("dashboard.skills.discover")}
                  </Link>
                </p>
              ) : (
                skillIds.map((sid) => {
                  const skill = getSkill(sid);
                  if (!skill) return null;
                  return (
                    <Link
                      key={sid}
                      to={`/skill/${sid}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {skill.title}
                      <Pencil
                        size={11}
                        className="opacity-0 transition group-hover:opacity-100"
                      />
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h2 className="text-lg font-semibold">{t("dashboard.quickActions.title")}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/match"
                className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-gradient-to-br from-aura-teal/10 to-aura-sky/10 p-3 transition hover:border-brand-400 hover:shadow-soft dark:border-slate-700"
              >
                <Sparkles size={18} className="text-aura-teal" />
                <span className="text-sm font-semibold">
                  {t("dashboard.quickActions.findTutor")}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("dashboard.quickActions.findTutorDesc")}
                </span>
              </Link>
              <Link
                to="/browse"
                className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-gradient-to-br from-aura-indigo/10 to-aura-violet/10 p-3 transition hover:border-brand-400 hover:shadow-soft dark:border-slate-700"
              >
                <Search size={18} className="text-aura-indigo" />
                <span className="text-sm font-semibold">
                  {t("dashboard.quickActions.browseSkills")}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("dashboard.quickActions.browseSkillsDesc")}
                </span>
              </Link>
              <Link
                to="/certificates"
                className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-gradient-to-br from-amber-400/10 to-orange-500/10 p-3 transition hover:border-brand-400 hover:shadow-soft dark:border-slate-700"
              >
                <GraduationCap size={18} className="text-orange-500" />
                <span className="text-sm font-semibold">
                  {t("dashboard.quickActions.certificates")}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("dashboard.quickActions.certificatesDesc")}
                </span>
              </Link>
              <Link
                to="/leaderboard"
                className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-gradient-to-br from-aura-violet/10 to-aura-orange/10 p-3 transition hover:border-brand-400 hover:shadow-soft dark:border-slate-700"
              >
                <Users size={18} className="text-aura-violet" />
                <span className="text-sm font-semibold">
                  {t("dashboard.quickActions.leaderboard")}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("dashboard.quickActions.leaderboardDesc")}
                </span>
              </Link>
            </div>

            {!user.premium && (
              <Link
                to="/premium"
                className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-aura-gradient p-3 text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Crown size={14} /> {t("dashboard.premium.title")}
                  </div>
                  <p className="text-xs text-white/85">
                    {t("dashboard.premium.subtitle")}
                  </p>
                </div>
                <span className="text-lg icon-flip" aria-hidden>
                  →
                </span>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
