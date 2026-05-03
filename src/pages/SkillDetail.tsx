import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, CheckCircle2, Gift, Globe, GraduationCap } from "lucide-react";
import { getSkill, skills } from "../data/skills";
import { getUser, users } from "../data/users";
import { categories } from "../data/categories";
import { Avatar } from "../components/ui/Avatar";
import { LevelBadge, Chip } from "../components/ui/Badge";
import { RatingStars } from "../components/ui/RatingStars";
import { CreditPill } from "../components/ui/CreditPill";
import { BookingDialog } from "../components/BookingDialog";
import { useTranslation } from "../i18n";
import type { Skill } from "../lib/types";

const REVIEW_KEYS = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;

export function SkillDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const skill = id ? getSkill(id) : undefined;
  const [open, setOpen] = useState(false);

  const tutor = skill ? getUser(skill.tutorId) : undefined;
  const cat = skill ? categories.find((c) => c.name === skill.category) : undefined;

  const similar = useMemo(() => {
    if (!skill) return [];
    return skills.filter((s) => s.category === skill.category && s.id !== skill.id).slice(0, 3);
  }, [skill]);

  const reviews = useMemo(() => {
    if (!skill) return [];
    const reviewers = users.filter((u) => u.id !== skill.tutorId).slice(0, 3);
    return reviewers.map((u, i) => ({
      user: u,
      rating: 4 + (i % 2 === 0 ? 1 : 0.5),
      commentKey: REVIEW_KEYS[i % REVIEW_KEYS.length],
      weeks: (i + 1) * 3,
    }));
  }, [skill]);

  const bullets = useMemo(() => {
    if (!skill) return [] as string[];
    const firstTag = skill.tags[0];
    const handsOn = firstTag
      ? t("skillDetail.bullets.handsOn", { tag: firstTag })
      : t("skillDetail.bullets.handsOnDefault");
    const base = [
      t("skillDetail.bullets.master", { skill: skill.title.toLowerCase() }),
      handsOn,
      t("skillDetail.bullets.confidence"),
    ];
    const tagBullets = skill.tags
      .slice(0, 2)
      .map((tag) => t("skillDetail.bullets.apply", { tag }));
    return [...base, ...tagBullets].slice(0, 5);
  }, [skill, t]);

  if (!skill) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-6xl">🔍</div>
        <h1 className="mt-4 text-2xl font-bold">{t("skillDetail.notFound.title")}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {t("skillDetail.notFound.desc")}
        </p>
        <Link to="/browse" className="btn-primary mt-6 inline-flex">
          <ArrowLeft size={16} className="icon-flip" /> {t("skillDetail.notFound.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden sm:h-72">
        <img src={skill.thumbnail} alt={skill.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/20" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-6 sm:px-6 lg:px-8">
          <Link
            to="/browse"
            className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/25"
          >
            <ArrowLeft size={12} className="icon-flip" /> {t("skillDetail.backToBrowse")}
          </Link>
          <h1 className="text-3xl font-extrabold text-white drop-shadow sm:text-4xl lg:text-5xl">
            {skill.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <LevelBadge level={skill.level} />
            {cat && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold dark:bg-slate-900/80">
                {cat.emoji} {t(`categories.${cat.name}`)}
              </span>
            )}
            <RatingStars value={skill.rating} count={skill.reviews} className="text-white" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold">{t("skillDetail.sections.about")}</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{skill.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">{t("skillDetail.sections.whatYoullLearn")}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold">{t("skillDetail.sections.learningStyle")}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skill.styles.map((s) => (
                  <Chip key={s} className="bg-aura-soft text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
                    {t(`styles.${s}`)}
                  </Chip>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">{t("skillDetail.sections.tags")}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <Chip key={tag}>#{tag}</Chip>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">{t("skillDetail.sections.reviews")}</h2>
              <div className="mt-4 space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="card !p-5">
                    <div className="flex items-start gap-3">
                      <Avatar src={r.user.avatar} name={r.user.name} size={40} />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="font-semibold">{r.user.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {r.user.country} · {t("skillDetail.reviews.whenWeeksAgo", { n: r.weeks })}
                            </div>
                          </div>
                          <RatingStars value={r.rating} />
                        </div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {t(`skillDetail.reviews.templates.${r.commentKey}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
            {tutor && (
              <div className="card">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("skillDetail.sidebar.meetTutor")}
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <Avatar src={tutor.avatar} name={tutor.name} size={56} ring />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{tutor.name}</span>
                      {tutor.verified && <BadgeCheck size={16} className="text-brand-500" />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Globe size={12} /> {tutor.country}
                    </div>
                    <RatingStars value={tutor.rating} count={tutor.reviews} className="mt-1" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{tutor.bio}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap size={12} /> {t("skillDetail.sidebar.hoursTaught", { hours: tutor.hoursTaught })}
                  </span>
                </div>
                <Link
                  to={`/profile/${tutor.id}`}
                  className="btn-outline mt-4 w-full justify-center py-2 text-sm"
                >
                  {t("skillDetail.sidebar.viewProfile")}
                </Link>
              </div>
            )}

            <div className="card bg-aura-soft dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("skillDetail.sidebar.cost")}
                </span>
                <CreditPill credits={skill.creditsPerHour} />
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t("skillDetail.sidebar.perHour")}
              </div>
              <button
                onClick={() => setOpen(true)}
                className="btn-primary mt-4 w-full justify-center"
              >
                {t("skillDetail.sidebar.bookSession")}
              </button>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-white p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Gift size={14} className="mt-0.5 shrink-0 text-aura-orange" />
                <span>
                  <strong>{t("skillDetail.sidebar.freeTrialLabel")}</strong>{" "}
                  {t("skillDetail.sidebar.freeTrialText")}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar skills */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold">{t("skillDetail.sections.similar")}</h2>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              {similar.map((s) => (
                <SimilarCard key={s.id} skill={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      <BookingDialog open={open} onOpenChange={setOpen} skill={skill} />
    </div>
  );
}

function SimilarCard({ skill }: { skill: Skill }) {
  return (
    <Link
      to={`/skill/${skill.id}`}
      className="card flex gap-3 p-4 transition hover:-translate-y-1 hover:shadow-glow"
    >
      <img src={skill.thumbnail} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{skill.title}</div>
        <p className="line-clamp-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
          {skill.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <RatingStars value={skill.rating} />
          <LevelBadge level={skill.level} />
        </div>
      </div>
    </Link>
  );
}
