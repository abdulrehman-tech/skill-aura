import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  Globe,
  GraduationCap,
  MapPin,
  MessageSquare,
  Pencil,
  Sparkles,
  Star,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { store } from "../lib/store";
import { users as seedUsers, getUser as getSeedUser } from "../data/users";
import { getSkill } from "../data/skills";
import { Avatar } from "../components/ui/Avatar";
import { LevelBadge, Chip } from "../components/ui/Badge";
import { RatingStars } from "../components/ui/RatingStars";
import { CreditPill } from "../components/ui/CreditPill";
import { cn } from "../lib/utils";
import { useTranslation } from "../i18n";
import type { User } from "../lib/types";

type Tab = "teaches" | "learning" | "reviews" | "badges";
type ReviewLineKey = "one" | "two" | "three" | "four" | "five";

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

interface MockReview {
  id: string;
  reviewerName: string;
  reviewerSeed: string;
  rating: number;
  lineKey: ReviewLineKey;
  daysAgo: number;
}

function buildReviews(user: User): MockReview[] {
  const others = seedUsers.filter((u) => u.id !== user.id).slice(0, 5);
  const lineKeys: ReviewLineKey[] = ["one", "two", "three", "four", "five"];
  return others.slice(0, Math.min(4, others.length)).map((o, i) => ({
    id: `r-${user.id}-${i}`,
    reviewerName: o.name,
    reviewerSeed: o.avatar,
    rating: Math.min(5, Math.round((user.rating + (i % 2 === 0 ? 0.1 : -0.1)) * 2) / 2),
    lineKey: lineKeys[i % lineKeys.length],
    daysAgo: 3 + i * 7,
  }));
}

function findUser(id: string): User | undefined {
  const stored = store.getUsers().find((u) => u.id === id);
  if (stored) return stored;
  return getSeedUser(id);
}

export function Profile() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useUser();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("teaches");

  const profileUser = useMemo(() => findUser(id), [id]);
  const reviews = useMemo(
    () => (profileUser ? buildReviews(profileUser) : []),
    [profileUser]
  );

  if (!profileUser) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-aura-soft text-4xl">
          <span aria-hidden>🔍</span>
        </div>
        <h1 className="text-2xl font-bold">{t("profile.notFound.title")}</h1>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {t("profile.notFound.description")}
        </p>
        <Link to="/browse" className="btn-primary mt-6">
          <Sparkles size={16} /> {t("profile.notFound.cta")}
        </Link>
      </div>
    );
  }

  const isOwn = currentUser?.id === profileUser.id;
  const flag = countryFlag[profileUser.country] ?? "🌐";

  const tabs: { key: Tab; labelKey: string; icon: typeof BookOpen; count?: number }[] = [
    { key: "teaches", labelKey: "profile.tabs.teaches", icon: GraduationCap, count: profileUser.teaches.length },
    { key: "learning", labelKey: "profile.tabs.learning", icon: BookOpen, count: profileUser.learning.length },
    { key: "reviews", labelKey: "profile.tabs.reviews", icon: MessageSquare, count: reviews.length },
    { key: "badges", labelKey: "profile.tabs.badgesTab", icon: Award },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-32 overflow-hidden rounded-t-3xl bg-aura-gradient sm:h-40">
          <div
            aria-hidden
            className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-12 start-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"
          />
        </div>
        <div className="px-5 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
              <div className="relative z-10 -mt-14 sm:-mt-16">
                <Avatar
                  src={profileUser.avatar}
                  name={profileUser.name}
                  size={120}
                  ring
                  className="shadow-glow"
                />
              </div>
              <div className="sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {profileUser.name}
                  </h1>
                  {profileUser.verified && (
                    <span
                      title={t("profile.badges.verified")}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                      <CheckCircle2 size={12} /> {t("profile.badges.verified")}
                    </span>
                  )}
                  {profileUser.premium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-aura-gradient px-2 py-0.5 text-xs font-semibold text-white">
                      {t("profile.badges.premium")}
                    </span>
                  )}
                </div>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="text-base" aria-hidden>{flag}</span>
                  <MapPin size={12} className="opacity-70" />
                  <span lang="en">{profileUser.country}</span>
                  <span className="opacity-40">•</span>
                  <Globe size={12} className="opacity-70" />
                  <span lang="en">{profileUser.language}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwn ? (
                <button
                  type="button"
                  onClick={() => alert(t("profile.actions.editAlert"))}
                  className="btn-outline"
                >
                  <Pencil size={16} /> {t("profile.actions.editProfile")}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => alert(t("profile.actions.messageAlert"))}
                    className="btn-outline"
                  >
                    <MessageSquare size={16} /> {t("profile.actions.message")}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/match")}
                    className="btn-primary"
                  >
                    <CalendarPlus size={16} /> {t("profile.actions.bookSession")}
                  </button>
                </>
              )}
            </div>
          </div>

          {profileUser.bio && (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {profileUser.bio}
            </p>
          )}

          {/* Stats row */}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("profile.stats.hoursTaught")}
              </dt>
              <dd className="mt-1 text-2xl font-bold">{profileUser.hoursTaught}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("profile.stats.hoursLearned")}
              </dt>
              <dd className="mt-1 text-2xl font-bold">{profileUser.hoursLearned}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("profile.stats.rating")}
              </dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {profileUser.rating.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({profileUser.reviews})
                </span>
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("profile.stats.credits")}
              </dt>
              <dd className="mt-2">
                <CreditPill credits={profileUser.credits} />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-6">
        <div
          role="tablist"
          aria-label={t("profile.tabsLabel")}
          className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          {tabs.map((tabItem) => {
            const active = tab === tabItem.key;
            const Icon = tabItem.icon;
            return (
              <button
                key={tabItem.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(tabItem.key)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition sm:flex-none",
                  active
                    ? "bg-aura-gradient text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                <Icon size={15} />
                {t(tabItem.labelKey)}
                {typeof tabItem.count === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] font-semibold",
                      active
                        ? "bg-white/25 text-white"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    )}
                  >
                    {tabItem.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {tab === "teaches" && (
            <SkillGrid ids={profileUser.teaches} emptyText={t("profile.skills.teachesEmpty")} />
          )}
          {tab === "learning" && (
            <SkillGrid ids={profileUser.learning} emptyText={t("profile.skills.learningEmpty")} />
          )}
          {tab === "reviews" && (
            <div className="grid gap-3 md:grid-cols-2">
              {reviews.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {t("profile.reviews.empty")}
                </p>
              ) : (
                reviews.map((r) => (
                  <article
                    key={r.id}
                    className="card animate-fade-in flex flex-col gap-3"
                  >
                    <header className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar src={r.reviewerSeed} name={r.reviewerName} size={36} />
                        <div>
                          <p className="text-sm font-semibold">{r.reviewerName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t("profile.reviews.daysAgo", { days: r.daysAgo })}
                          </p>
                        </div>
                      </div>
                      <RatingStars value={r.rating} size={12} />
                    </header>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      “{t(`profile.reviews.lines.${r.lineKey}`)}”
                    </p>
                  </article>
                ))
              )}
            </div>
          )}
          {tab === "badges" && (
            <div className="card flex flex-wrap gap-2">
              {profileUser.badges.map((b) => (
                <LevelBadge key={b} level={b} />
              ))}
              {profileUser.verified && (
                <Chip className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  <CheckCircle2 size={12} /> {t("profile.badges.verified")}
                </Chip>
              )}
              {profileUser.premium && (
                <Chip className="bg-aura-gradient text-white">{t("profile.badges.premiumMember")}</Chip>
              )}
              {profileUser.hoursTaught >= 30 && (
                <Chip className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                  {t("profile.badges.topMentor")}
                </Chip>
              )}
              {profileUser.hoursLearned >= 20 && (
                <Chip className="bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">
                  {t("profile.badges.eagerLearner")}
                </Chip>
              )}
              {profileUser.teaches.length >= 2 && (
                <Chip className="bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                  {t("profile.badges.multiSkilled")}
                </Chip>
              )}
              {profileUser.rating >= 4.85 && (
                <Chip className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">
                  <Star size={12} /> {t("profile.badges.crowdFavourite")}
                </Chip>
              )}
              {profileUser.badges.length === 0 && !profileUser.verified && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("profile.badges.empty")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillGrid({ ids, emptyText }: { ids: string[]; emptyText: string }) {
  const { t } = useTranslation();
  if (ids.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {emptyText}
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ids.map((sid) => {
        const skill = getSkill(sid);
        if (!skill) return null;
        return (
          <article
            key={sid}
            className="card flex flex-col gap-3 transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{skill.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {skill.category}
                </p>
              </div>
              <LevelBadge level={skill.level} />
            </div>
            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
              {skill.description}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <RatingStars value={skill.rating} count={skill.reviews} size={12} />
              <Link
                to={`/skill/${skill.id}`}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {t("profile.skills.view")}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Profile;
