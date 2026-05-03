import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BarChart3,
  Check,
  ChevronDown,
  CreditCard,
  Crown,
  Quote,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { store } from "../lib/store";
import { useTranslation } from "../i18n";
import { cn } from "../lib/utils";

const FREE_FEATURE_KEYS = ["f1", "f2", "f3", "f4", "f5"] as const;
const PREMIUM_FEATURE_KEYS = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"] as const;
const FAQ_KEYS = ["credits", "premium", "certificates", "refund", "cancel", "expire"] as const;

export function Premium() {
  const { t } = useTranslation();
  const user = useUser();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [upgraded, setUpgraded] = useState(false);

  const isPremium = !!user?.premium || upgraded;

  function upgrade() {
    if (!user) return;
    store.updateUser({ ...user, premium: true });
    setUpgraded(true);
    window.alert(t("premium.premiumPlan.welcome"));
  }

  const monthlyPrice = "$9.99";
  const yearlyPrice = "$95";
  const displayPrice = billing === "monthly" ? monthlyPrice : yearlyPrice;
  const displayPeriod = billing === "monthly" ? t("premium.pricing.perMonth") : t("premium.pricing.perYear");

  const highlights = [
    {
      icon: Award,
      title: t("premium.highlights.certificates.title"),
      text: t("premium.highlights.certificates.text"),
    },
    {
      icon: Zap,
      title: t("premium.highlights.matching.title"),
      text: t("premium.highlights.matching.text"),
    },
    {
      icon: BarChart3,
      title: t("premium.highlights.analytics.title"),
      text: t("premium.highlights.analytics.text"),
    },
  ];

  const testimonials = [
    {
      name: t("premium.testimonials.t1.name"),
      text: t("premium.testimonials.t1.text"),
      country: t("premium.testimonials.t1.country"),
    },
    {
      name: t("premium.testimonials.t2.name"),
      text: t("premium.testimonials.t2.text"),
      country: t("premium.testimonials.t2.country"),
    },
    {
      name: t("premium.testimonials.t3.name"),
      text: t("premium.testimonials.t3.text"),
      country: t("premium.testimonials.t3.country"),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-aura-gradient text-white">
        <img
          src="https://images.unsplash.com/photo-1582623888319-29bfe72bb7d3?auto=format&fit=crop&w=1600&q=70"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_45%)]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/40" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 animate-fade-in">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles size={14} /> {t("premium.hero.pill")}
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t("premium.hero.titlePart1")} <span className="block">{t("premium.hero.titlePart2")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            {t("premium.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#pricing" className="rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
              {t("premium.hero.ctaTrial")}
            </a>
            <Link to="/browse" className="rounded-xl bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/25">
              {t("premium.hero.ctaBrowse")}
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("premium.pricing.title")}</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {t("premium.pricing.subtitle")}
          </p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                billing === "monthly"
                  ? "bg-aura-gradient text-white shadow-soft"
                  : "text-slate-600 dark:text-slate-300"
              )}
            >
              {t("premium.pricing.monthly")}
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition",
                billing === "yearly"
                  ? "bg-aura-gradient text-white shadow-soft"
                  : "text-slate-600 dark:text-slate-300"
              )}
            >
              {t("premium.pricing.yearly")}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  billing === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                )}
              >
                {t("premium.pricing.save")}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="card flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{t("premium.free.name")}</h3>
                  {!isPremium && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {t("premium.free.currentPlan")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("premium.free.tagline")}
                </p>
              </div>
              <Shield className="text-slate-400" size={28} />
            </div>
            <div className="mt-5">
              <span className="text-4xl font-extrabold">{t("premium.free.price")}</span>
              <span className="text-slate-500 dark:text-slate-400">{t("premium.pricing.forever")}</span>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm">
              {FREE_FEATURE_KEYS.map((k) => (
                <li key={k} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {t(`premium.free.features.${k}`)}
                  </span>
                </li>
              ))}
            </ul>
            <button disabled className="btn-outline mt-6 w-full justify-center">
              {isPremium ? t("premium.free.downgrade") : t("premium.free.youreOnFree")}
            </button>
          </div>

          {/* Premium */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-aura-gradient opacity-90 blur-md" />
            <div className="relative rounded-2xl bg-aura-gradient p-[2px] shadow-glow">
              <div className="flex h-full flex-col rounded-[14px] bg-white p-6 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold">{t("premium.premiumPlan.name")}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-aura-gradient px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
                        <Star size={10} className="fill-current" /> {t("premium.premiumPlan.mostPopular")}
                      </span>
                      {isPremium && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                          {t("premium.premiumPlan.active")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t("premium.premiumPlan.tagline")}
                    </p>
                  </div>
                  <Crown className="text-aura-orange" size={28} />
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gradient">{displayPrice}</span>
                  <span className="text-slate-500 dark:text-slate-400">{displayPeriod}</span>
                </div>
                {billing === "yearly" && (
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                    {t("premium.pricing.yearlyHint")}
                  </p>
                )}
                <ul className="mt-5 space-y-2.5 text-sm">
                  {PREMIUM_FEATURE_KEYS.map((k, i) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-aura-gradient text-white">
                        <Check size={11} />
                      </span>
                      <span
                        className={cn(
                          "text-slate-700 dark:text-slate-300",
                          i === 0 && "font-semibold"
                        )}
                      >
                        {t(`premium.premiumPlan.features.${k}`)}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={upgrade}
                  disabled={isPremium || !user}
                  className="btn-primary mt-6 w-full justify-center"
                >
                  {isPremium ? (
                    <>
                      <Check size={16} /> {t("premium.premiumPlan.activeBtn")}
                    </>
                  ) : !user ? (
                    <>
                      <Crown size={16} /> {t("premium.premiumPlan.loginToUpgrade")}
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> {t("premium.premiumPlan.upgrade")}
                    </>
                  )}
                </button>
                {upgraded && !user?.premium && (
                  <p className="mt-3 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in">
                    {t("premium.premiumPlan.welcome")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {highlights.map((f) => (
            <div key={f.title} className="card flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aura-soft text-brand-600">
                <f.icon size={18} />
              </div>
              <div>
                <div className="font-semibold">{f.title}</div>
                <div className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((tt) => (
            <div key={tt.name} className="card relative">
              <Quote className="absolute end-4 top-4 text-brand-200 dark:text-brand-900" size={32} />
              <p className="text-sm text-slate-700 dark:text-slate-200">"{tt.text}"</p>
              <div className="mt-4 text-xs">
                <div className="font-semibold">{tt.name}</div>
                <div className="text-slate-500 dark:text-slate-400">{tt.country}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">{t("premium.faq.title")}</h2>
        <div className="mt-8 space-y-3">
          {FAQ_KEYS.map((k, i) => {
            const open = openFaq === i;
            return (
              <div
                key={k}
                className="rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start"
                  aria-expanded={open}
                >
                  <span className="font-semibold">{t(`premium.faq.items.${k}.q`)}</span>
                  <ChevronDown
                    size={18}
                    className={cn("shrink-0 transition-transform", open && "rotate-180")}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 animate-fade-in">
                    {t(`premium.faq.items.${k}.a`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-slate-200 bg-white/50 py-10 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-5">
              {[
                { name: "Visa", url: "https://cdn.simpleicons.org/visa/1A1F71" },
                { name: "Mastercard", url: "https://cdn.simpleicons.org/mastercard/EB001B" },
                { name: "American Express", url: "https://cdn.simpleicons.org/americanexpress/2E77BC" },
                { name: "Apple Pay", url: "https://cdn.simpleicons.org/applepay/000000" },
                { name: "Google Pay", url: "https://cdn.simpleicons.org/googlepay/4285F4" },
                { name: "PayPal", url: "https://cdn.simpleicons.org/paypal/00457C" },
                { name: "Stripe", url: "https://cdn.simpleicons.org/stripe/635BFF" },
              ].map((b) => (
                <img
                  key={b.name}
                  src={b.url}
                  alt={b.name}
                  title={b.name}
                  loading="lazy"
                  className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 dark:invert dark:opacity-50"
                />
              ))}
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <ShieldCheck size={16} className="text-emerald-500" />
              {t("premium.trust.secure")} <strong>{t("premium.trust.stripe")}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <CreditCard size={12} /> {t("premium.trust.encryption")}
              </span>
              <span>{t("premium.trust.moneyBack")}</span>
              <span>{t("premium.trust.cancelAnytime")}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
