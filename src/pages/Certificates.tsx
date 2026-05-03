import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { Award, Compass, Crown, Download, Share2, Sparkles } from "lucide-react";
import { useUser } from "../hooks/useUser";
import { certificates as seedCertificates } from "../data/certificates";
import { Logo } from "../components/ui/Logo";
import { cn } from "../lib/utils";
import { useTranslation } from "../i18n";
import type { Locale } from "../i18n";
import type { Category, Certificate, User } from "../lib/types";

const categoryAccent: Record<Category, string> = {
  Languages: "from-sky-400 via-indigo-400 to-violet-500",
  Design: "from-fuchsia-400 via-pink-400 to-rose-500",
  Cooking: "from-orange-400 via-amber-400 to-rose-500",
  Photography: "from-cyan-400 via-teal-400 to-emerald-500",
  Programming: "from-violet-500 via-indigo-500 to-blue-500",
  Makeup: "from-pink-400 via-fuchsia-400 to-purple-500",
  Academic: "from-emerald-400 via-teal-400 to-cyan-500",
};

function generateMockCertificates(user: User): Certificate[] {
  const count = Math.min(3, Math.max(0, Math.floor(user.hoursLearned / 12)));
  if (count === 0) return [];
  const samplePool: { skill: string; category: Category }[] = [
    { skill: "Conversational Arabic", category: "Languages" },
    { skill: "Figma Design Mastery", category: "Design" },
    { skill: "Python for Beginners", category: "Programming" },
    { skill: "Portrait Photography", category: "Photography" },
    { skill: "Beginner Japanese", category: "Languages" },
    { skill: "Calculus & Statistics", category: "Academic" },
  ];
  return Array.from({ length: count }).map((_, i) => {
    const sample = samplePool[i % samplePool.length];
    const issued = new Date(Date.now() - (i + 1) * 30 * 86400000).toISOString();
    return {
      id: `mock-${user.id}-${i}`,
      userId: user.id,
      skill: sample.skill,
      category: sample.category,
      hours: 12 + i * 6,
      issuedAt: issued,
    };
  });
}

function fmtDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function CertificateCard({ cert, userName }: { cert: Certificate; userName: string }) {
  const { t, locale } = useTranslation();
  const accent = categoryAccent[cert.category];
  const certNumber = `SA-${cert.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase().padStart(6, "0")}`;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-gradient-to-br p-1 shadow-soft transition hover:-translate-y-1 hover:shadow-glow animate-fade-in",
        accent
      )}
    >
      <div className="relative rounded-[22px] bg-white p-6 dark:bg-slate-900 sm:p-8">
        {/* Decorative corners */}
        <div
          aria-hidden
          className={cn(
            "absolute -end-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-15 blur-2xl",
            accent
          )}
        />
        <div
          aria-hidden
          className={cn(
            "absolute -bottom-16 -start-12 h-44 w-44 rounded-full bg-gradient-to-br opacity-10 blur-2xl",
            accent
          )}
        />

        <header className="relative flex items-start justify-between gap-4">
          <Logo size={32} />
          <div className="text-end">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {t("certificates.card.idLabel")}
            </p>
            <p className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
              {certNumber}
            </p>
          </div>
        </header>

        <div className="relative mt-6 flex flex-col items-center text-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-soft",
              accent
            )}
          >
            <Award size={12} /> {t(`categories.${cert.category}`)}
          </span>

          <h3 className="mt-4 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            {t("certificates.card.heading")}
          </h3>

          <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">
            {t("certificates.card.certifies")}
          </p>
          <p className="mt-1 text-xl font-bold text-gradient sm:text-2xl">{userName}</p>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t("certificates.card.bodyText", { hours: cert.hours, skill: cert.skill })}
          </p>
        </div>

        <footer className="relative mt-7 flex items-end justify-between gap-4">
          <div>
            <div
              aria-hidden
              className="font-signature -mb-1 text-2xl italic text-slate-700 dark:text-slate-200"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              {t("certificates.card.signature")}
            </div>
            <div className="border-t border-slate-300 pt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {t("certificates.card.signatureLine")}
            </div>
          </div>
          <div className="text-end">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {t("certificates.card.issuedLabel")}
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {fmtDate(cert.issuedAt, locale)}
            </p>
          </div>
        </footer>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              alert(t("certificates.card.downloadAlert", { skill: cert.skill }))
            }
            className="btn-primary !py-2 !px-4 !text-sm"
          >
            <Download size={14} /> {t("certificates.card.download")}
          </button>
          <button
            type="button"
            onClick={() =>
              alert(t("certificates.card.shareAlert", { skill: cert.skill }))
            }
            className="btn-outline !py-2 !px-4 !text-sm"
          >
            <Share2 size={14} /> {t("certificates.card.share")}
          </button>
        </div>
      </div>
    </article>
  );
}

export function Certificates() {
  const user = useUser();
  const { t } = useTranslation();

  const certs = useMemo(() => {
    if (!user) return [];
    const owned = seedCertificates.filter((c) => c.userId === user.id);
    if (owned.length > 0) return owned;
    return generateMockCertificates(user);
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-aura-soft px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <Award size={12} /> {t("certificates.badge")}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("certificates.titlePrefix")}{" "}
            <span className="text-gradient">{t("certificates.titleHighlight")}</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            {t("certificates.subtitle")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("certificates.totalLabel")}
          </p>
          <p className="text-2xl font-bold text-gradient">{certs.length}</p>
        </div>
      </header>

      {/* Certificates grid or empty state */}
      {certs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-aura-soft text-5xl">
            <span aria-hidden>📜</span>
          </div>
          <h2 className="mt-4 text-xl font-bold">{t("certificates.empty.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {t("certificates.empty.description")}
          </p>
          <Link to="/browse" className="btn-primary mt-6">
            <Compass size={16} /> {t("certificates.empty.browseSkills")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {certs.map((c) => (
            <CertificateCard key={c.id} cert={c} userName={user.name} />
          ))}
        </div>
      )}

      {/* Premium tip */}
      {!user.premium && (
        <aside className="mt-10 overflow-hidden rounded-3xl bg-aura-gradient p-1 shadow-soft">
          <div className="flex flex-col items-start gap-4 rounded-[22px] bg-white/95 p-6 backdrop-blur dark:bg-slate-900/95 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aura-gradient text-white shadow-soft">
                <Crown size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold">
                  {t("certificates.premium.title")}{" "}
                  <span className="text-gradient">
                    {t("certificates.premium.titleHighlight")}
                  </span>{" "}
                  {t("certificates.premium.titleSuffix")}
                </h3>
                <p className="mt-1 max-w-lg text-sm text-slate-600 dark:text-slate-300">
                  {t("certificates.premium.description")}
                </p>
              </div>
            </div>
            <Link to="/premium" className="btn-primary shrink-0">
              <Sparkles size={16} /> {t("certificates.premium.cta")}
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Certificates;
