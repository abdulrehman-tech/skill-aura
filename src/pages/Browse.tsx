import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, SearchX } from "lucide-react";
import { skills } from "../data/skills";
import { categories } from "../data/categories";
import { getUser } from "../data/users";
import { Avatar } from "../components/ui/Avatar";
import { LevelBadge } from "../components/ui/Badge";
import { RatingStars } from "../components/ui/RatingStars";
import { CreditPill } from "../components/ui/CreditPill";
import { BookingDialog } from "../components/BookingDialog";
import { useTranslation } from "../i18n";
import type { Category, Level, Skill } from "../lib/types";
import { cn } from "../lib/utils";

const LEVELS: ("All" | Level)[] = ["All", "Beginner", "Intermediate", "Expert", "Pro"];
type Sort = "rating" | "reviews" | "newest";

export function Browse() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const initialCat = (params.get("category") as Category) || "All";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>(initialCat);
  const [level, setLevel] = useState<"All" | Level>("All");
  const [sort, setSort] = useState<Sort>("rating");
  const [bookingSkill, setBookingSkill] = useState<Skill | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = skills.filter((s) => {
      const tutor = getUser(s.tutorId);
      const matchesQ =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        (tutor?.name.toLowerCase().includes(q) ?? false);
      const matchesCat = category === "All" || s.category === category;
      const matchesLevel = level === "All" || s.level === level;
      return matchesQ && matchesCat && matchesLevel;
    });

    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") list = [...list].sort((a, b) => b.reviews - a.reviews);
    else if (sort === "newest")
      list = [...list].sort((a, b) => parseInt(b.id.replace(/\D/g, "")) - parseInt(a.id.replace(/\D/g, "")));
    return list;
  }, [query, category, level, sort]);

  function setCat(c: "All" | Category) {
    setCategory(c);
    if (c === "All") {
      params.delete("category");
    } else {
      params.set("category", c);
    }
    setParams(params, { replace: true });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="animate-fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("browse.titlePart1")} <span className="text-gradient">{t("browse.titlePart2")}</span>
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {t("browse.subtitle", { count: skills.length })}
        </p>
      </header>

      {/* Sticky filter bar */}
      <div className="sticky top-2 z-20 mt-6">
        <div className="glass rounded-2xl p-4 shadow-soft">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("browse.searchPlaceholder")}
                className="input ps-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 sm:flex dark:text-slate-400">
                <SlidersHorizontal size={14} />
                {t("browse.filtersLabel")}
              </div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "All" | Level)}
                className="input w-auto py-2 text-sm"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l === "All" ? t("browse.allLevels") : t(`levels.${l}`)}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="input w-auto py-2 text-sm"
              >
                <option value="rating">{t("browse.sort.rating")}</option>
                <option value="reviews">{t("browse.sort.reviews")}</option>
                <option value="newest">{t("browse.sort.newest")}</option>
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <CatChip
              label={t("browse.allCategoryChip")}
              active={category === "All"}
              onClick={() => setCat("All")}
            />
            {categories.map((c) => (
              <CatChip
                key={c.name}
                label={`${c.emoji} ${t(`categories.${c.name}`)}`}
                active={category === c.name}
                onClick={() => setCat(c.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Counter */}
      <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        {filtered.length === 1
          ? t("browse.resultCountSingular", { count: filtered.length })
          : t("browse.resultCount", { count: filtered.length })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState onReset={() => { setQuery(""); setCat("All"); setLevel("All"); }} />
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SkillCard key={s.id} skill={s} onBook={() => setBookingSkill(s)} />
          ))}
        </div>
      )}

      {bookingSkill && (
        <BookingDialog
          open={!!bookingSkill}
          onOpenChange={(o) => !o && setBookingSkill(null)}
          skill={bookingSkill}
        />
      )}
    </div>
  );
}

function CatChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
        active
          ? "bg-aura-gradient text-white shadow-soft"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      )}
    >
      {label}
    </button>
  );
}

function SkillCard({ skill, onBook }: { skill: Skill; onBook: () => void }) {
  const { t } = useTranslation();
  const tutor = getUser(skill.tutorId);
  const cat = categories.find((c) => c.name === skill.category);

  return (
    <article className="group card flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-glow animate-fade-in">
      <div className="relative h-44 overflow-hidden">
        <img
          src={skill.thumbnail}
          alt={skill.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        {cat && (
          <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold shadow-soft backdrop-blur-sm dark:bg-slate-900/80">
            <span>{cat.emoji}</span>
            {t(`categories.${cat.name}`)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight">{skill.title}</h3>
          <LevelBadge level={skill.level} />
        </div>
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {skill.description}
        </p>

        {tutor && (
          <Link
            to={`/profile/${tutor.id}`}
            className="flex items-center gap-2 text-sm hover:text-brand-600"
          >
            <Avatar src={tutor.avatar} name={tutor.name} size={28} />
            <div className="min-w-0">
              <div className="truncate font-medium">{tutor.name}</div>
              <div className="truncate text-xs text-slate-500 dark:text-slate-400">{tutor.country}</div>
            </div>
          </Link>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <RatingStars value={skill.rating} count={skill.reviews} />
          <CreditPill credits={skill.creditsPerHour} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link to={`/skill/${skill.id}`} className="btn-outline justify-center py-2 text-sm">
            {t("browse.card.view")}
          </Link>
          <button onClick={onBook} className="btn-primary justify-center py-2 text-sm">
            {t("browse.card.book")}
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-aura-soft text-brand-600">
        <SearchX size={26} />
      </div>
      <div>
        <h3 className="text-base font-semibold">{t("browse.empty.title")}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("browse.empty.desc")}
        </p>
      </div>
      <button onClick={onReset} className="btn-outline">
        {t("browse.empty.reset")}
      </button>
    </div>
  );
}
