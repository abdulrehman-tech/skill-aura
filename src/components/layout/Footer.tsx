import { Link } from "react-router-dom";
import { Globe, MessageCircle, Send, Mail } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useTranslation } from "../../i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-400">
            {t("footer.tagline")}
          </p>
          <div className="mt-4 flex gap-2">
            {[Globe, MessageCircle, Send, Mail].map((Icon, i) => (
              <a key={i} href="#" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">{t("footer.platform")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/browse" className="hover:text-brand-600">{t("footer.browse")}</Link></li>
            <li><Link to="/match" className="hover:text-brand-600">{t("footer.smartMatch")}</Link></li>
            <li><Link to="/leaderboard" className="hover:text-brand-600">{t("footer.leaderboard")}</Link></li>
            <li><Link to="/premium" className="hover:text-brand-600">{t("footer.premium")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">{t("footer.account")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/signup" className="hover:text-brand-600">{t("footer.signUp")}</Link></li>
            <li><Link to="/login" className="hover:text-brand-600">{t("footer.login")}</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-600">{t("footer.dashboard")}</Link></li>
            <li><Link to="/certificates" className="hover:text-brand-600">{t("footer.certificates")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
