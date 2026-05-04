import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gift,
  GraduationCap,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { store } from "../lib/store";
import { skills } from "../data/skills";
import type {
  AvailabilitySlot,
  LearningStyle,
  User,
} from "../lib/types";
import { cn } from "../lib/utils";
import { useTranslation } from "../i18n";

const learningStyles: LearningStyle[] = [
  "Conversational",
  "Visual",
  "Hands-on",
  "Theoretical",
];
const availabilityOptions: AvailabilitySlot[] = [
  "Morning",
  "Afternoon",
  "Evening",
  "Weekend",
];

type Step = 1 | 2 | 3;

interface FormState {
  name: string;
  email: string;
  country: string;
  teaches: string[]; // skill ids
  learning: string[]; // skill ids
  style: LearningStyle | "";
  availability: AvailabilitySlot[];
}

const initial: FormState = {
  name: "",
  email: "",
  country: "",
  teaches: [],
  learning: [],
  style: "",
  availability: [],
};

export function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );

  const skillTitleById = useMemo(() => {
    const m = new Map<string, string>();
    skills.forEach((s) => m.set(s.id, s.title));
    return m;
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleInArray<T extends string>(key: keyof FormState, value: T) {
    setForm((f) => {
      const list = (f[key] as string[]) ?? [];
      const next = list.includes(value)
        ? list.filter((x) => x !== value)
        : [...list, value];
      return { ...f, [key]: next };
    });
  }

  function validateStep(s: Step): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (s === 1) {
      if (!form.name.trim()) next.name = t("signup.errors.nameRequired");
      if (!form.email.trim()) next.email = t("signup.errors.emailRequired");
      else if (!/^\S+@\S+\.\S+$/.test(form.email))
        next.email = t("signup.errors.emailInvalid");
      if (!form.country.trim()) next.country = t("signup.errors.countryRequired");
    }
    if (s === 2) {
      if (form.teaches.length === 0)
        next.teaches = t("signup.errors.teachAtLeastOne");
      if (form.learning.length === 0)
        next.learning = t("signup.errors.learnAtLeastOne");
    }
    if (s === 3) {
      if (!form.style) next.style = t("signup.errors.styleRequired");
      if (form.availability.length === 0)
        next.availability = t("signup.errors.availabilityRequired");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  }
  function prev() {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep(3)) return;
    if (!validateStep(1) || !validateStep(2)) return;

    const seed = encodeURIComponent(form.name || form.email);
    const newUser: User = {
      id: `u-new-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
      bio: t("signup.defaultBio"),
      country: form.country.trim(),
      language: "English",
      credits: 5,
      hoursTaught: 0,
      hoursLearned: 0,
      rating: 5,
      reviews: 0,
      badges: ["Beginner"],
      verified: false,
      premium: false,
      teaches: form.teaches,
      learning: form.learning,
      availability: form.availability,
      styles: form.style ? [form.style] : [],
    };

    // Persist into the users list and set as current user
    const existing = store.getUsers();
    const merged = [...existing, newUser];
    // store.getUsers() seeds from data on first run; updateUser only edits.
    // Persist the full list directly via updateUser fallback: write through localStorage by adding then updating.
    // The store has no addUser, so we use localStorage-aware updateUser by first persisting the list.
    try {
      localStorage.setItem("skillaura.users", JSON.stringify(merged));
    } catch {
      // ignore storage errors in private mode
    }
    store.setCurrentUser(newUser);
    navigate("/dashboard");
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Visual aside — lg+ only */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=1400&q=75"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-aura-gradient opacity-85 mix-blend-multiply" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-aura-indigo/70 via-aura-violet/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Logo size={48} className="[&_span]:text-white" />
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {t("signup.titlePart1")}{" "}
              <span className="text-white/70">{t("signup.titlePart2")}</span>
            </h2>
            <p className="max-w-sm text-white/85">
              {t("signup.welcomeBonus", { credits: 5 })}
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { n: "12K+", l: "learners" },
                { n: "850+", l: "exchanges" },
                { n: "47", l: "countries" },
                { n: "4.9★", l: "rating" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
                  <div className="text-xl font-bold">{s.n}</div>
                  <div className="text-xs text-white/70" lang="en">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-white/70">© 2026 Skillora · Built in Oman 🇴🇲</div>
        </div>
      </aside>

      {/* Form panel */}
      <div className="relative overflow-hidden bg-aura-soft px-4 py-10 dark:bg-slate-950 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 end-0 h-96 w-96 rounded-full bg-aura-gradient opacity-25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 start-0 h-96 w-96 rounded-full bg-gradient-to-br from-aura-teal to-aura-violet opacity-20 blur-3xl"
        />

      <div className="relative mx-auto w-full max-w-2xl animate-fade-in">
        <div className="mb-6 flex justify-center">
          <Logo size={56} />
        </div>

        {/* Welcome bonus */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-aura-gradient px-4 py-1.5 text-sm font-semibold text-white shadow-glow">
            <Gift size={14} />
            {t("signup.welcomeBonus", { credits: 5 })}
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t("signup.titlePart1")}{" "}
              <span className="text-gradient">{t("signup.titlePart2")}</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("signup.stepIndicator", { current: step, total: 3 })}
            </p>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  n <= step
                    ? "bg-aura-gradient"
                    : "bg-slate-200 dark:bg-slate-800"
                )}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            {step === 1 && (
              <section
                className="animate-fade-in space-y-5"
                aria-labelledby="step-1-heading"
              >
                <h2
                  id="step-1-heading"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <UserIcon size={18} className="text-brand-600" />
                  {t("signup.steps.aboutYou")}
                </h2>

                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    {t("signup.fields.fullName")}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder={t("signup.fields.fullNamePlaceholder")}
                    className="input"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      {t("signup.fields.email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder={t("signup.fields.emailPlaceholder")}
                      className="input"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      {t("signup.fields.country")}
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      placeholder={t("signup.fields.countryPlaceholder")}
                      className="input"
                      aria-invalid={Boolean(errors.country)}
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section
                className="animate-fade-in space-y-7"
                aria-labelledby="step-2-heading"
              >
                <h2
                  id="step-2-heading"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Sparkles size={18} className="text-brand-600" />
                  {t("signup.steps.yourSkills")}
                </h2>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      {t("signup.fields.teachLabel")}
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {t("signup.fields.selectedCount", {
                        count: form.teaches.length,
                      })}
                    </span>
                  </div>
                  <SkillChips
                    selected={form.teaches}
                    onToggle={(id) => toggleInArray("teaches", id)}
                  />
                  {errors.teaches && (
                    <p className="mt-2 text-xs text-rose-600">
                      {errors.teaches}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      {t("signup.fields.learnLabel")}
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {t("signup.fields.selectedCount", {
                        count: form.learning.length,
                      })}
                    </span>
                  </div>
                  <SkillChips
                    selected={form.learning}
                    onToggle={(id) => toggleInArray("learning", id)}
                    excludeIds={form.teaches}
                  />
                  {errors.learning && (
                    <p className="mt-2 text-xs text-rose-600">
                      {errors.learning}
                    </p>
                  )}
                  {form.teaches.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {t("signup.fields.hidingTeaching", {
                        names: form.teaches
                          .map((id) => skillTitleById.get(id))
                          .filter(Boolean)
                          .join(", "),
                      })}
                    </p>
                  )}
                </div>
              </section>
            )}

            {step === 3 && (
              <section
                className="animate-fade-in space-y-7"
                aria-labelledby="step-3-heading"
              >
                <h2
                  id="step-3-heading"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <GraduationCap size={18} className="text-brand-600" />
                  {t("signup.steps.preferences")}
                </h2>

                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t("signup.fields.learningStyle")}
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {learningStyles.map((s) => {
                      const checked = form.style === s;
                      return (
                        <label
                          key={s}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm transition dark:bg-slate-900",
                            checked
                              ? "border-brand-500 ring-2 ring-brand-100 dark:ring-brand-900/40"
                              : "border-slate-200 hover:border-brand-300 dark:border-slate-700"
                          )}
                        >
                          <input
                            type="radio"
                            name="learning-style"
                            value={s}
                            checked={checked}
                            onChange={() => update("style", s)}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border",
                              checked
                                ? "border-brand-500 bg-brand-500 text-white"
                                : "border-slate-300 dark:border-slate-600"
                            )}
                            aria-hidden
                          >
                            {checked && <Check size={12} />}
                          </span>
                          <span className="font-medium">
                            {t(`signup.styles.${s}`)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.style && (
                    <p className="mt-2 text-xs text-rose-600">{errors.style}</p>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t("signup.fields.availability")}
                  </legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {availabilityOptions.map((a) => {
                      const checked = form.availability.includes(a);
                      return (
                        <label
                          key={a}
                          className={cn(
                            "flex cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm transition dark:bg-slate-900",
                            checked
                              ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                              : "border-slate-200 hover:border-brand-300 dark:border-slate-700"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInArray("availability", a)}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded border",
                              checked
                                ? "border-brand-500 bg-brand-500 text-white"
                                : "border-slate-300 dark:border-slate-600"
                            )}
                            aria-hidden
                          >
                            {checked && <Check size={10} />}
                          </span>
                          {t(`signup.availability.${a}`)}
                        </label>
                      );
                    })}
                  </div>
                  {errors.availability && (
                    <p className="mt-2 text-xs text-rose-600">
                      {errors.availability}
                    </p>
                  )}
                </fieldset>
              </section>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prev}
                  className="btn-ghost"
                >
                  <ArrowLeft size={16} className="icon-flip" /> {t("signup.nav.back")}
                </button>
              ) : (
                <span />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="btn-primary"
                >
                  {t("signup.nav.continue")} <ArrowRight size={16} className="icon-flip" />
                </button>
              ) : (
                <button type="submit" className="btn-primary">
                  {t("signup.nav.createAccount")} <ArrowRight size={16} className="icon-flip" />
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          {t("signup.haveAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300"
          >
            {t("signup.login")}
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}

function SkillChips({
  selected,
  onToggle,
  excludeIds = [],
}: {
  selected: string[];
  onToggle: (id: string) => void;
  excludeIds?: string[];
}) {
  const visible = skills.filter((s) => !excludeIds.includes(s.id));
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((s) => {
        const isOn = selected.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onToggle(s.id)}
            aria-pressed={isOn}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              isOn
                ? "border-transparent bg-aura-gradient text-white shadow-soft"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-brand-200"
            )}
          >
            {s.title}
          </button>
        );
      })}
    </div>
  );
}

export default Signup;
