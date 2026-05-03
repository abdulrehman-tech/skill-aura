import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { categories } from "../data/categories";
import { matchTutors, type MatchResult } from "../lib/matching";
import { Avatar } from "../components/ui/Avatar";
import { LevelBadge, Chip } from "../components/ui/Badge";
import { RatingStars } from "../components/ui/RatingStars";
import { CreditPill } from "../components/ui/CreditPill";
import { BookingDialog } from "../components/BookingDialog";
import { useTranslation } from "../i18n";
import type {
  AvailabilitySlot,
  Category,
  LearningStyle,
  Skill,
} from "../lib/types";
import { cn } from "../lib/utils";

const AVAIL: AvailabilitySlot[] = ["Morning", "Afternoon", "Evening", "Weekend"];
const STYLES: LearningStyle[] = ["Conversational", "Visual", "Hands-on", "Theoretical"];

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

function translateReason(raw: string, t: TranslateFn): string {
  const matches = raw.match(/^Matches "(.*)"$/);
  if (matches) return t("match.reasons.matches", { q: matches[1] });

  const cat = raw.match(/^Category: (.*)$/);
  if (cat) {
    const name = cat[1];
    const localized = t(`categories.${name}`);
    return t("match.reasons.category", { category: localized && localized !== `categories.${name}` ? localized : name });
  }

  const avail = raw.match(/^Available (.*)$/);
  if (avail) {
    const slot = avail[1];
    const localized = t(`availability.${slot}`);
    return t("match.reasons.availability", { slot: localized && localized !== `availability.${slot}` ? localized : slot });
  }

  const style = raw.match(/^(.*) learning style$/);
  if (style) {
    const s = style[1];
    const localized = t(`styles.${s}`);
    return t("match.reasons.style", { style: localized && localized !== `styles.${s}` ? localized : s });
  }

  if (raw === "Verified tutor") return t("match.reasons.verified");

  return raw;
}

export function Match() {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [skillQuery, setSkillQuery] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [availability, setAvailability] = useState<AvailabilitySlot | "">("");
  const [style, setStyle] = useState<LearningStyle | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingSkill, setBookingSkill] = useState<Skill | null>(null);

  const results = useMemo<MatchResult[]>(() => {
    if (!submitted) return [];
    return matchTutors({
      skillQuery,
      category: category || undefined,
      availability: availability || undefined,
      style: style || undefined,
    });
  }, [submitted, skillQuery, category, availability, style]);

  function reset() {
    setStep(1);
    setSkillQuery("");
    setCategory("");
    setAvailability("");
    setStyle("");
    setSubmitted(false);
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {!submitted ? (
        <div className="animate-fade-in">
          {/* Hero */}
          <div className="text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-gradient text-white shadow-glow">
              <Sparkles size={26} />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("match.hero.titlePart1")} <span className="text-gradient">{t("match.hero.titlePart2")}</span>
            </h1>
            <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
              {t("match.hero.subtitle")}
            </p>
          </div>

          {/* Progress dots */}
          <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  step >= s ? "w-8 bg-aura-gradient" : "w-2 bg-slate-200 dark:bg-slate-700"
                )}
              />
            ))}
          </div>

          {/* Wizard card */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="card animate-slide-up !p-8">
              <div className="text-xs font-medium uppercase tracking-wider text-brand-600">
                {t("match.stepIndicator", { current: step, total: 3 })}
              </div>

              {step === 1 && (
                <div className="mt-3 animate-fade-in">
                  <h2 className="text-2xl font-bold">{t("match.step1.title")}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("match.step1.desc")}
                  </p>
                  <input
                    autoFocus
                    value={skillQuery}
                    onChange={(e) => setSkillQuery(e.target.value)}
                    placeholder={t("match.step1.placeholder")}
                    className="input mt-5 text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && skillQuery.trim()) setStep(2);
                    }}
                  />

                  <div className="mt-6">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t("match.step1.orPickCategory")}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <CatToggle
                        label={t("match.step1.anyCategory")}
                        active={category === ""}
                        onClick={() => setCategory("")}
                      />
                      {categories.map((c) => (
                        <CatToggle
                          key={c.name}
                          label={`${c.emoji} ${t(`categories.${c.name}`)}`}
                          active={category === c.name}
                          onClick={() => setCategory(c.name)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mt-3 animate-fade-in">
                  <h2 className="text-2xl font-bold">{t("match.step2.title")}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("match.step2.desc")}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <CatToggle
                      label={t("match.step2.anyTime")}
                      active={availability === ""}
                      onClick={() => setAvailability("")}
                      large
                    />
                    {AVAIL.map((a) => (
                      <CatToggle
                        key={a}
                        label={t(`availability.${a}`)}
                        active={availability === a}
                        onClick={() => setAvailability(a)}
                        large
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mt-3 animate-fade-in">
                  <h2 className="text-2xl font-bold">{t("match.step3.title")}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("match.step3.desc")}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <CatToggle
                      label={t("match.step3.mixItUp")}
                      active={style === ""}
                      onClick={() => setStyle("")}
                      large
                    />
                    {STYLES.map((s) => (
                      <CatToggle
                        key={s}
                        label={t(`styles.${s}`)}
                        active={style === s}
                        onClick={() => setStyle(s)}
                        large
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
                  disabled={step === 1}
                  className="btn-ghost disabled:opacity-40"
                >
                  <ArrowLeft size={16} className="icon-flip" /> {t("match.nav.back")}
                </button>
                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => ((s + 1) as 1 | 2 | 3))}
                    disabled={step === 1 && !skillQuery.trim() && !category}
                    className="btn-primary"
                  >
                    {t("match.nav.next")} <ArrowRight size={16} className="icon-flip" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn-primary">
                    <Wand2 size={16} /> {t("match.nav.findMatches")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {t("match.results.titlePart1")} <span className="text-gradient">{t("match.results.titlePart2")}</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("match.results.foundCount", { count: results.length })}
                {skillQuery && (
                  <>
                    {" "}{t("match.results.foundFor")} <strong>"{skillQuery}"</strong>
                  </>
                )}
                {category && (
                  <>
                    {" "}
                    {t("match.results.foundIn", { category: t(`categories.${category}`) })}
                  </>
                )}
              </p>
            </div>
            <button onClick={reset} className="btn-outline">
              <RotateCcw size={16} /> {t("match.nav.startOver")}
            </button>
          </div>

          {results.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
              <div className="text-5xl">🔮</div>
              <h3 className="mt-4 text-lg font-semibold">{t("match.results.empty.title")}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("match.results.empty.desc")}
              </p>
              <button onClick={reset} className="btn-primary mt-5">
                <RotateCcw size={16} /> {t("match.nav.tryAgain")}
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {results.map((r, i) => (
                <MatchCard
                  key={r.skill.id + i}
                  result={r}
                  rank={i + 1}
                  onBook={() => setBookingSkill(r.skill)}
                />
              ))}
            </div>
          )}
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

function CatToggle({
  label,
  active,
  onClick,
  large,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border text-sm font-medium transition",
        large ? "px-4 py-3" : "rounded-full px-3.5 py-1.5 text-xs",
        active
          ? "border-transparent bg-aura-gradient text-white shadow-soft"
          : "border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      )}
    >
      {label}
    </button>
  );
}

function MatchCard({
  result,
  rank,
  onBook,
}: {
  result: MatchResult;
  rank: number;
  onBook: () => void;
}) {
  const { t } = useTranslation();
  const { skill, tutor, score, reasons } = result;
  const maxScore = 13; // ~5 + 3 + 2 + 2 + 5 (rating cap)
  const pct = Math.min(100, Math.round((score / maxScore) * 100));

  return (
    <article className="card flex flex-col gap-4 transition hover:-translate-y-1 hover:shadow-glow animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="relative">
          <img src={skill.thumbnail} alt="" className="h-16 w-16 rounded-xl object-cover" />
          <span className="absolute -start-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-aura-gradient text-[11px] font-bold text-white shadow-soft">
            {rank}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/skill/${skill.id}`} className="truncate font-semibold hover:text-brand-600">
              {skill.title}
            </Link>
            <LevelBadge level={skill.level} />
          </div>
          <Link to={`/profile/${tutor.id}`} className="mt-1 flex items-center gap-2 text-sm hover:text-brand-600">
            <Avatar src={tutor.avatar} name={tutor.name} size={20} />
            <span className="text-slate-600 dark:text-slate-300">{tutor.name}</span>
            <span className="text-xs text-slate-400">· {tutor.country}</span>
          </Link>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-300">{t("match.card.matchScore")}</span>
          <span className="font-semibold text-brand-600">{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-aura-gradient transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {reasons.map((r, i) => (
            <Chip key={i} className="bg-aura-soft text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
              {translateReason(r, t)}
            </Chip>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <RatingStars value={skill.rating} count={skill.reviews} />
        <CreditPill credits={skill.creditsPerHour} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link to={`/skill/${skill.id}`} className="btn-outline justify-center py-2 text-sm">
          {t("match.card.viewDetails")}
        </Link>
        <button onClick={onBook} className="btn-primary justify-center py-2 text-sm">
          {t("match.card.bookSession")}
        </button>
      </div>
    </article>
  );
}
