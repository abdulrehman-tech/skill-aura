import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Languages, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Avatar } from "../ui/Avatar";
import { CreditPill } from "../ui/CreditPill";
import { useUser } from "../../hooks/useUser";
import { store } from "../../lib/store";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../i18n";

export function Navbar() {
  const user = useUser();
  const nav = useNavigate();
  const { t, locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => store.getTheme());

  useEffect(() => {
    store.setTheme(theme);
  }, [theme]);

  const navItems = [
    { to: "/browse", label: t("nav.browse") },
    { to: "/match", label: t("nav.smartMatch") },
    { to: "/sessions", label: t("nav.sessions") },
    { to: "/leaderboard", label: t("nav.leaderboard") },
    { to: "/premium", label: t("nav.premium") },
  ];

  const toggleLocale = () => setLocale(locale === "en" ? "ar" : "en");

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 glass dark:border-slate-800/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocale}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={t("nav.changeLanguage")}
            title={t("nav.changeLanguage")}
          >
            <Languages size={16} />
            <span>{locale === "en" ? "العربية" : "EN"}</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={t("nav.toggleTheme")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <CreditPill credits={user.credits} className="hidden sm:inline-flex" />
              <Link to={`/profile/${user.id}`}>
                <Avatar name={user.name} src={user.avatar} size={36} ring />
              </Link>
              <button
                onClick={() => {
                  store.setCurrentUser(null);
                  nav("/");
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label={t("nav.logout")}
              >
                <LogOut size={18} className="icon-flip" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">{t("nav.login")}</Link>
              <Link to="/signup" className="btn-primary">{t("nav.getStarted")}</Link>
            </>
          )}

          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("nav.menu")}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-1">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-medium",
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 dark:text-slate-200"
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
            {user && (
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                {t("nav.dashboard")}
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
