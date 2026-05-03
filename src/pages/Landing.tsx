import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  Award,
  BookOpen,
  Globe2,
  ShieldCheck,
  Crown,
  GraduationCap,
  Target,
  Quote,
  Star,
} from "lucide-react";
import { categories } from "../data/categories";
import { users } from "../data/users";
import { Avatar } from "../components/ui/Avatar";
import { RatingStars } from "../components/ui/RatingStars";
import { LevelBadge } from "../components/ui/Badge";
import type { User } from "../lib/types";
import { useTranslation } from "../i18n";

const stats: { key: string; value: string }[] = [
  { key: "learners", value: "12K+" },
  { key: "exchanges", value: "850+" },
  { key: "countries", value: "47" },
  { key: "rating", value: "4.9★" },
];

const features: { icon: string; key: string }[] = [
  { icon: "🎯", key: "smartMatch" },
  { icon: "⏱️", key: "timeCredits" },
  { icon: "📚", key: "wideRange" },
  { icon: "🏆", key: "ratingBadges" },
  { icon: "🤝", key: "groupSessions" },
  { icon: "🌍", key: "crossCultural" },
  { icon: "🔒", key: "verification" },
  { icon: "💼", key: "premium" },
  { icon: "🎓", key: "certificates" },
];

export function Landing() {
  const { t } = useTranslation();

  const steps: { icon: React.ReactNode; title: string; desc: string }[] = [
    {
      icon: <Sparkles size={22} />,
      title: t("landing.how.steps.signupTitle"),
      desc: t("landing.how.steps.signupDesc"),
    },
    {
      icon: <Target size={22} />,
      title: t("landing.how.steps.matchTitle"),
      desc: t("landing.how.steps.matchDesc"),
    },
    {
      icon: <Clock size={22} />,
      title: t("landing.how.steps.creditsTitle"),
      desc: t("landing.how.steps.creditsDesc"),
    },
  ];

  const featuredTutors: User[] = [...users]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden bg-aura-soft">
        <img
          src="https://images.unsplash.com/photo-1582623888319-29bfe72bb7d3?auto=format&fit=crop&w=1800&q=70"
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-multiply"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 end-[-8rem] h-[480px] w-[480px] rounded-full bg-aura-gradient opacity-30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 start-[-8rem] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-aura-teal to-aura-violet opacity-25 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur dark:border-brand-900 dark:bg-slate-900/60 dark:text-brand-200">
              <Sparkles size={12} /> {t("landing.hero.pill")}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{t("landing.hero.titlePart1")}</span>{" "}
              {t("landing.hero.titlePart2")}
              <br />
              {t("landing.hero.titlePart3")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              {t("landing.hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="btn-primary text-base">
                {t("landing.hero.ctaPrimary")}{" "}
                <ArrowRight size={18} className="icon-flip" />
              </Link>
              <Link to="/browse" className="btn-outline text-base">
                {t("landing.hero.ctaSecondary")}
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {users.slice(0, 4).map((u) => (
                  <Avatar key={u.id} src={u.avatar} name={u.name} size={32} ring />
                ))}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">
                  {t("landing.hero.socialProof")}
                </span>{" "}
                {t("landing.hero.socialProofRest")}
              </div>
            </div>
          </div>

          {/* Hero illustration */}
          <div className="relative h-[420px] sm:h-[460px]">
            <div
              aria-hidden
              className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-aura-gradient opacity-90 shadow-glow blur-[2px]"
            />
            <div className="glass absolute start-4 top-6 w-60 rounded-2xl p-4 shadow-soft animate-slide-up">
              <div className="flex items-center gap-3">
                <Avatar src={users[0].avatar} name={users[0].name} size={40} ring />
                <div>
                  <div className="text-sm font-semibold">
                    {t("landing.hero.cardTeaches", { name: users[0].name.split(" ")[0] })}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t("landing.hero.cardSkillArabic")}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <RatingStars value={4.9} count={42} />
                <LevelBadge level="Expert" />
              </div>
            </div>

            <div
              className="glass absolute end-2 top-32 w-56 rounded-2xl p-4 shadow-soft animate-slide-up"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex items-center gap-3">
                <Avatar src={users[2].avatar} name={users[2].name} size={40} ring />
                <div>
                  <div className="text-sm font-semibold">
                    {t("landing.hero.cardTeaches", { name: users[2].name.split(" ")[0] })}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t("landing.hero.cardSkillFigma")}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <RatingStars value={4.95} count={51} />
                <LevelBadge level="Pro" />
              </div>
            </div>

            <div
              className="glass absolute bottom-6 start-10 w-64 rounded-2xl p-4 shadow-soft animate-slide-up"
              style={{ animationDelay: "240ms" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-600" />
                  <span className="text-sm font-semibold">
                    {t("landing.hero.matchFound")}
                  </span>
                </div>
                <span className="rounded-full bg-aura-gradient px-2 py-0.5 text-[10px] font-bold text-white">
                  98%
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t("landing.hero.matchDesc")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.key} className="text-center">
              <div className="text-3xl font-extrabold text-gradient sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t(`landing.stats.${s.key}`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GOVERNORATES STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="chip mb-3 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
            From Muscat to Salalah 🇴🇲
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Built for every <span className="text-gradient">governorate</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Trusted by Omani learners across 11 governorates.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-start justify-center gap-6">
          {[
            { name: "Muscat", id: "1582623888319-29bfe72bb7d3" },
            { name: "Muttrah", id: "1599488615731-7e5c2823ff28" },
            { name: "Nizwa", id: "1565953554355-7c2d0d0fd8ea" },
            { name: "Sohar", id: "1606068666834-80862432e25c" },
            { name: "Salalah", id: "1502780402662-acc01917347e" },
            { name: "Khasab", id: "1518709594023-6eab9bab7b23" },
          ].map((g) => (
            <div key={g.name} className="flex flex-col items-center gap-2">
              <img
                src={`https://images.unsplash.com/photo-${g.id}?auto=format&fit=crop&w=200&q=70`}
                alt={g.name}
                loading="lazy"
                className="h-20 w-20 rounded-2xl object-cover shadow-soft transition hover:scale-105 hover:shadow-glow"
              />
              <span lang="en" className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {g.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("landing.how.titlePart1")}{" "}
            <span className="text-gradient">{t("landing.how.titlePart2")}</span>{" "}
            {t("landing.how.titlePart3")}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {t("landing.how.subtitle")}
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute start-[16%] end-[16%] top-9 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent md:block dark:via-brand-700"
          />
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-aura-gradient text-white shadow-glow">
                {s.icon}
              </div>
              <div className="mt-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {i + 1}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50 py-20 dark:bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("landing.categories.titlePart1")}{" "}
                <span className="text-gradient">
                  {t("landing.categories.titlePart2")}
                </span>
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {t("landing.categories.subtitle")}
              </p>
            </div>
            <Link
              to="/browse"
              className="hidden text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 sm:inline-flex sm:items-center sm:gap-1"
            >
              {t("landing.categories.viewAll")}{" "}
              <ArrowRight size={14} className="icon-flip" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                to={`/browse?category=${encodeURIComponent(c.name)}`}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.color} p-6 text-white shadow-soft transition hover:-translate-y-1 hover:shadow-glow`}
              >
                <div className="text-4xl">{c.emoji}</div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-lg font-bold">
                      {t(`categories.${c.name}`)}
                    </div>
                    <div className="text-xs text-white/80">
                      {t("landing.categories.skillsCount", { count: c.count })}
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="icon-flip opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            <Sparkles size={12} /> {t("landing.features.pill")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("landing.features.title")}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {t("landing.features.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.key}
              className="card group hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl transition group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold">
                  {t(`landing.features.${f.key}.title`)}
                </h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {t(`landing.features.${f.key}.desc`)}
              </p>
            </article>
          ))}
        </div>

        {/* Feature icons row (lucide accent) */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-400 dark:text-slate-600">
          <Users size={18} />
          <BookOpen size={18} />
          <Award size={18} />
          <Globe2 size={18} />
          <ShieldCheck size={18} />
          <Crown size={18} />
          <GraduationCap size={18} />
        </div>
      </section>

      {/* FEATURED TUTORS */}
      <section className="bg-slate-50 py-20 dark:bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("landing.tutors.titlePart1")}{" "}
                <span className="text-gradient">
                  {t("landing.tutors.titlePart2")}
                </span>
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {t("landing.tutors.subtitle")}
              </p>
            </div>
            <Link
              to="/browse"
              className="hidden text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 sm:inline-flex sm:items-center sm:gap-1"
            >
              {t("landing.tutors.seeMore")}{" "}
              <ArrowRight size={14} className="icon-flip" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTutors.map((u) => (
              <article
                key={u.id}
                className="card group flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-glow"
              >
                <Avatar src={u.avatar} name={u.name} size={72} ring />
                <h3 className="mt-4 text-base font-semibold">{u.name}</h3>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {u.country}
                </div>
                <div className="mt-2">
                  <RatingStars value={u.rating} count={u.reviews} />
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {u.badges.slice(0, 2).map((b) => (
                    <LevelBadge key={b} level={b} />
                  ))}
                </div>
                <Link
                  to={`/profile/${u.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300"
                >
                  {t("landing.tutors.viewProfile")}{" "}
                  <ArrowRight size={14} className="icon-flip" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / VALUE */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-14">
          <Quote
            aria-hidden
            className="absolute -start-2 -top-2 text-brand-100 dark:text-brand-900/50"
            size={120}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="flex justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} className="fill-amber-400" />
              ))}
            </div>
            <p className="mt-6 text-2xl font-semibold leading-snug sm:text-3xl">
              “{t("landing.testimonial.quotePart1")}{" "}
              <span className="text-gradient">
                {t("landing.testimonial.quoteHighlight")}
              </span>{" "}
              {t("landing.testimonial.quotePart2")}”
            </p>
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              {t("landing.testimonial.attribution")}
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-aura-gradient p-10 text-white shadow-glow sm:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -start-20 h-72 w-72 rounded-full bg-aura-orange/40 blur-3xl"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
                {t("landing.cta.title")}
              </h2>
              <p className="mt-4 max-w-xl text-white/90">
                {t("landing.cta.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow-soft transition hover:-translate-y-0.5"
              >
                {t("landing.cta.createAccount")}{" "}
                <ArrowRight size={18} className="icon-flip" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {t("landing.cta.haveAccount")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
