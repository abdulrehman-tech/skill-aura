import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { Avatar } from "../components/ui/Avatar";
import { store } from "../lib/store";
import { users } from "../data/users";
import { useTranslation } from "../i18n";

export function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Curated quick-login picks
  const quickLogins = [users[0], users[2], users[5]];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setError(t("login.emailRequired"));
      return;
    }
    setError(null);
    // Mock: any email logs in as the first user (Layla)
    store.setCurrentUser(users[0]);
    navigate("/dashboard");
  }

  function loginAs(userId: string) {
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    store.setCurrentUser(u);
    navigate("/dashboard");
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Visual aside — lg+ only */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1582623888319-29bfe72bb7d3?auto=format&fit=crop&w=1400&q=75"
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
              {t("login.titlePart1")}{" "}
              <span className="text-white/70">{t("login.titlePart2")}</span>
            </h2>
            <p className="max-w-sm text-white/85">{t("login.subtitle")}</p>
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
          <div className="text-xs text-white/70">© 2026 Skill Aura · Built in Oman 🇴🇲</div>
        </div>
      </aside>

      {/* Form panel */}
      <div className="relative flex items-center justify-center overflow-hidden bg-aura-soft px-4 py-12 dark:bg-slate-950 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 start-[-8rem] h-96 w-96 rounded-full bg-aura-gradient opacity-30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 end-[-8rem] h-96 w-96 rounded-full bg-gradient-to-br from-aura-teal to-aura-violet opacity-25 blur-3xl"
        />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-6 flex justify-center">
          <Logo size={56} />
        </div>

        <div className="card shadow-glow">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t("login.titlePart1")}{" "}
              <span className="text-gradient">{t("login.titlePart2")}</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs text-brand-800 dark:border-brand-900 dark:bg-brand-900/30 dark:text-brand-200">
            <Sparkles size={14} className="mt-0.5 shrink-0" />
            <span>
              <strong>{t("login.demoLabel")}</strong> {t("login.demoText")}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {t("login.emailLabel")}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  className="input ps-9"
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {t("login.passwordLabel")}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  className="input ps-9"
                />
              </div>
            </div>

            {error && (
              <p id="login-error" role="alert" className="text-xs text-rose-600">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full">
              {t("login.submit")} <ArrowRight size={16} className="icon-flip" />
            </button>
          </form>

          {/* Quick login */}
          <div className="mt-7">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-slate-400">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              {t("login.quickLoginDivider")}
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {quickLogins.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => loginAs(u.id)}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                  aria-label={t("login.tryAs", { name: u.name })}
                >
                  <Avatar
                    src={u.avatar}
                    name={u.name}
                    size={40}
                    ring
                    className="transition group-hover:scale-105"
                  />
                  <div className="text-xs font-medium leading-tight">
                    {u.name.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {u.country}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            {t("login.newToBrand")}{" "}
            <Link
              to="/signup"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300"
            >
              {t("login.createAccount")}
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          {t("login.prototypeNote")}
        </p>
      </div>
      </div>
    </div>
  );
}

export default Login;
