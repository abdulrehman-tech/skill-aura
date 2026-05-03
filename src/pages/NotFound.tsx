import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Search } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { useTranslation } from "../i18n";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-aura-soft px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-[-8rem] h-96 w-96 rounded-full bg-aura-gradient opacity-30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 end-[-8rem] h-96 w-96 rounded-full bg-gradient-to-br from-aura-teal to-aura-violet opacity-25 blur-3xl"
      />

      <div className="relative w-full max-w-xl text-center animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>

        <h1 className="text-[8rem] font-extrabold leading-none tracking-tight text-gradient sm:text-[10rem]">
          {t("notFound.code")}
        </h1>

        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {t("notFound.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-300">
          {t("notFound.subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <ArrowLeft size={16} className="icon-flip" /> {t("notFound.backHome")}
          </Link>
          <Link to="/browse" className="btn-outline">
            <Search size={16} /> {t("notFound.browseSkills")}
          </Link>
          <Link to="/match" className="btn-ghost">
            <Compass size={16} /> {t("notFound.smartMatch")}
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-500 dark:text-slate-400">
          {t("notFound.helperText")}
        </p>
      </div>
    </div>
  );
}

export default NotFound;
