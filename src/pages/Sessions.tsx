import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  CalendarOff,
  CalendarX2,
  MessageSquare,
  Star,
  Users as UsersIcon,
  Video,
  XCircle,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { store } from "../lib/store";
import { getSkill } from "../data/skills";
import { getUser } from "../data/users";
import { Avatar } from "../components/ui/Avatar";
import { RatingStars } from "../components/ui/RatingStars";
import { useTranslation } from "../i18n";
import type { Session } from "../lib/types";
import { cn, formatDate, relativeTime } from "../lib/utils";

type Tab = "upcoming" | "past" | "group";

export function Sessions() {
  const { t } = useTranslation();
  const user = useUser();
  const [sessions, setSessions] = useState<Session[]>(() => store.getSessions());
  const [tab, setTab] = useState<Tab>("upcoming");

  useEffect(() => {
    const handler = () => setSessions(store.getSessions());
    window.addEventListener("skillaura:sessions", handler);
    return () => window.removeEventListener("skillaura:sessions", handler);
  }, []);

  const mine = useMemo(() => {
    if (!user) return [];
    return sessions
      .filter((s) => s.participants.includes(user.id))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [sessions, user]);

  const filtered = useMemo(() => {
    if (tab === "upcoming") return mine.filter((s) => s.status === "upcoming");
    if (tab === "past") return mine.filter((s) => s.status !== "upcoming");
    return mine.filter((s) => s.type === "group");
  }, [mine, tab]);

  if (!user) return <Navigate to="/login" replace />;

  function cancel(id: string) {
    if (!window.confirm(t("sessions.confirmCancel"))) return;
    const updated = sessions.map((s) => (s.id === id ? { ...s, status: "cancelled" as const } : s));
    store.saveSessions(updated);
  }

  const counts = {
    upcoming: mine.filter((s) => s.status === "upcoming").length,
    past: mine.filter((s) => s.status !== "upcoming").length,
    group: mine.filter((s) => s.type === "group").length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="animate-fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("sessions.title.part1")}{" "}
          <span className="text-gradient">{t("sessions.title.part2")}</span>
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {t("sessions.subtitle")}
        </p>
      </header>

      {/* Tabs */}
      <div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        {([
          { k: "upcoming", label: t("sessions.tabs.upcoming"), n: counts.upcoming },
          { k: "past", label: t("sessions.tabs.past"), n: counts.past },
          { k: "group", label: t("sessions.tabs.group"), n: counts.group },
        ] as const).map((tabItem) => (
          <button
            key={tabItem.k}
            onClick={() => setTab(tabItem.k)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
              tab === tabItem.k
                ? "bg-aura-gradient text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            {tabItem.label}
            <span
              className={cn(
                "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                tab === tabItem.k
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              {tabItem.n}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              currentUserId={user.id}
              onCancel={() => cancel(s.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function typeStyle(type: Session["type"]) {
  switch (type) {
    case "private":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200";
    case "group":
      return "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200";
    case "cultural":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200";
  }
}

function SessionCard({
  session,
  currentUserId,
  onCancel,
}: {
  session: Session;
  currentUserId: string;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const skill = getSkill(session.skillId);
  const isTutor = session.tutorId === currentUserId;
  const counterpart = isTutor ? getUser(session.learnerId) : getUser(session.tutorId);
  const others = session.participants.filter((p) => p !== currentUserId);
  const otherUsers = others.map((id) => getUser(id)).filter(Boolean);

  return (
    <article className="card animate-fade-in transition hover:shadow-glow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-start gap-3">
          {skill && (
            <img
              src={skill.thumbnail}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={skill ? `/skill/${skill.id}` : "#"}
                className="truncate font-semibold hover:text-brand-600"
              >
                {skill?.title ?? "Skill"}
              </Link>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  typeStyle(session.type)
                )}
              >
                {t(`session.type.${session.type}`)}
              </span>
              {session.status === "cancelled" && (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
                  {t("sessions.card.cancelled")}
                </span>
              )}
            </div>

            {counterpart && (
              <Link
                to={`/profile/${counterpart.id}`}
                className="mt-1.5 inline-flex items-center gap-2 text-sm hover:text-brand-600"
              >
                <Avatar src={counterpart.avatar} name={counterpart.name} size={20} />
                <span>
                  {isTutor ? t("sessions.card.learner") : t("sessions.card.tutor")}:{" "}
                  <strong>{counterpart.name}</strong>
                </span>
              </Link>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{formatDate(session.startsAt)}</span>
              <span>·</span>
              <span>{relativeTime(session.startsAt)}</span>
              <span>·</span>
              <span>{t("sessions.card.hours", { count: session.durationHours })}</span>
            </div>

            {session.type === "group" && otherUsers.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <UsersIcon size={14} className="text-slate-400" />
                <div className="flex -space-x-2">
                  {otherUsers.slice(0, 4).map(
                    (u) =>
                      u && (
                        <Avatar
                          key={u.id}
                          src={u.avatar}
                          name={u.name}
                          size={24}
                          ring
                        />
                      )
                  )}
                </div>
                {otherUsers.length > 4 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {t("sessions.card.morePeople", { count: otherUsers.length - 4 })}
                  </span>
                )}
              </div>
            )}

            {session.notes && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                <MessageSquare size={14} className="mt-0.5 shrink-0 text-slate-400" />
                <span className="italic">"{session.notes}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
          {session.status === "upcoming" ? (
            <>
              <button className="btn-primary w-full justify-center px-4 py-2 text-sm sm:w-auto">
                <Video size={16} /> {t("sessions.card.join")}
              </button>
              <button
                onClick={onCancel}
                className="btn-ghost w-full justify-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 sm:w-auto"
              >
                <XCircle size={16} /> {t("sessions.card.cancel")}
              </button>
            </>
          ) : session.status === "completed" ? (
            session.rating ? (
              <div className="flex flex-col items-end gap-1">
                <RatingStars value={session.rating} />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t("sessions.card.yourRating")}
                </span>
              </div>
            ) : (
              <button className="btn-outline w-full justify-center px-4 py-2 text-sm sm:w-auto">
                <Star size={14} /> {t("sessions.card.leaveReview")}
              </button>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const { t } = useTranslation();
  const config = {
    upcoming: {
      icon: <CalendarOff size={26} />,
      title: t("sessions.empty.upcoming.title"),
      text: t("sessions.empty.upcoming.text"),
      cta: { to: "/browse", label: t("sessions.empty.upcoming.cta") },
    },
    past: {
      icon: <CalendarX2 size={26} />,
      title: t("sessions.empty.past.title"),
      text: t("sessions.empty.past.text"),
      cta: { to: "/browse", label: t("sessions.empty.past.cta") },
    },
    group: {
      icon: <UsersIcon size={26} />,
      title: t("sessions.empty.group.title"),
      text: t("sessions.empty.group.text"),
      cta: { to: "/match", label: t("sessions.empty.group.cta") },
    },
  } as const;
  const m = config[tab];

  return (
    <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40 animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-aura-soft text-brand-600">
        {m.icon}
      </div>
      <div>
        <h3 className="text-base font-semibold">{m.title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{m.text}</p>
      </div>
      <Link to={m.cta.to} className="btn-primary">
        {m.cta.label}
      </Link>
    </div>
  );
}
