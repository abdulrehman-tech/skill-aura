import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock, Users, User as UserIcon } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Avatar } from "./ui/Avatar";
import { LevelBadge } from "./ui/Badge";
import { CreditPill } from "./ui/CreditPill";
import { useUser } from "../hooks/useUser";
import { store } from "../lib/store";
import { getUser } from "../data/users";
import type { Session, Skill } from "../lib/types";
import { cn } from "../lib/utils";
import { useTranslation } from "../i18n";

const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00", "18:00", "20:00"];
const DURATION_VALUES = [1, 1.5, 2] as const;

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingDialog({
  open,
  onOpenChange,
  skill,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  skill: Skill;
}) {
  const currentUser = useUser();
  const tutor = getUser(skill.tutorId);
  const { t } = useTranslation();

  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState(TIME_SLOTS[2]);
  const [duration, setDuration] = useState<number>(1);
  const [type, setType] = useState<"private" | "group">("private");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setNotes("");
        setDate(todayStr());
        setTime(TIME_SLOTS[2]);
        setDuration(1);
        setType("private");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const cost = useMemo(() => Math.round(duration * skill.creditsPerHour * 10) / 10, [duration, skill.creditsPerHour]);
  const insufficient = !!currentUser && currentUser.credits < cost;

  function handleConfirm() {
    if (!currentUser) return;
    const startsAt = new Date(`${date}T${time}:00`).toISOString();
    const session: Session = {
      id: `se-${Date.now()}`,
      skillId: skill.id,
      tutorId: skill.tutorId,
      learnerId: currentUser.id,
      participants: [currentUser.id, skill.tutorId],
      startsAt,
      durationHours: duration,
      status: "upcoming",
      type,
      notes: notes.trim() || undefined,
    };
    store.addSession(session);
    store.updateUser({ ...currentUser, credits: Math.max(0, currentUser.credits - cost) });
    setSuccess(true);
  }

  const durationLabel = (v: number): string => {
    const key = v === 1 ? "1" : v === 1.5 ? "1.5" : v === 2 ? "2" : String(v);
    return t(`booking.durationOptions.${key}`);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={success ? t("booking.successHeading") : t("booking.title")}
      description={
        success
          ? undefined
          : tutor?.name
          ? t("booking.description", { name: tutor.name })
          : t("booking.descriptionFallback")
      }
      className="max-w-2xl"
    >
      {!currentUser ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-aura-soft">
            <UserIcon className="text-brand-600" size={26} />
          </div>
          <div>
            <h3 className="text-base font-semibold">{t("booking.loginRequired")}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("booking.loginHint")}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="btn-primary" onClick={() => onOpenChange(false)}>
              {t("booking.loginCta")}
            </Link>
            <Link to="/signup" className="btn-outline" onClick={() => onOpenChange(false)}>
              {t("booking.signupCta")}
            </Link>
          </div>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("booking.successTitle")}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("booking.successMessage", {
                title: skill.title,
                date,
                time,
                duration,
              })}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Link to="/sessions" className="btn-primary" onClick={() => onOpenChange(false)}>
              {t("booking.viewSessions")}
            </Link>
            <button className="btn-ghost" onClick={() => onOpenChange(false)}>
              {t("booking.close")}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  {t("booking.date")}
                </label>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="date"
                    min={todayStr()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input ps-9"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  {t("booking.time")}
                </label>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="input">
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                {t("booking.duration")}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input"
              >
                {DURATION_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {durationLabel(v)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                {t("booking.type")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["private", "group"] as const).map((opt) => (
                  <label
                    key={opt}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition",
                      type === opt
                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                    )}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={opt}
                      checked={type === opt}
                      onChange={() => setType(opt)}
                      className="sr-only"
                    />
                    {opt === "private" ? <UserIcon size={16} /> : <Users size={16} />}
                    <span>{opt === "private" ? t("booking.typePrivate") : t("booking.typeGroup")}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                {t("booking.notes")} <span className="text-slate-400">{t("booking.notesOptional")}</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("booking.notesPlaceholder")}
                rows={3}
                className="input resize-none"
              />
            </div>
          </div>

          {/* Cost summary */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-aura-soft p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("booking.summary")}
              </div>
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={skill.thumbnail}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{skill.title}</div>
                  <div className="mt-0.5">
                    <LevelBadge level={skill.level} />
                  </div>
                </div>
              </div>
              {tutor && (
                <div className="mt-3 flex items-center gap-2 border-t border-slate-200/70 pt-3 dark:border-slate-700">
                  <Avatar src={tutor.avatar} name={tutor.name} size={28} />
                  <div className="text-xs">
                    <div className="font-medium">{tutor.name}</div>
                    <div className="text-slate-500 dark:text-slate-400">{tutor.country}</div>
                  </div>
                </div>
              )}
              <div className="mt-3 space-y-1.5 border-t border-slate-200/70 pt-3 text-sm dark:border-slate-700">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{t("booking.duration")}</span>
                  <span>{durationLabel(duration)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{t("booking.rate")}</span>
                  <span>{t("booking.rateValue", { credits: skill.creditsPerHour })}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold">{t("booking.totalCost")}</span>
                  <CreditPill credits={cost} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock size={12} />
                {t("booking.balance")}{" "}
                <span className="font-semibold">
                  {t("booking.balanceValue", { credits: currentUser.credits })}
                </span>
              </div>
            </div>

            {insufficient && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>
                  {t("booking.insufficientCredits", {
                    required: cost,
                    available: currentUser.credits,
                  })}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2 md:mt-auto">
              <button
                onClick={handleConfirm}
                disabled={insufficient}
                className="btn-primary w-full"
              >
                {t("booking.confirm")}
              </button>
              <button onClick={() => onOpenChange(false)} className="btn-ghost w-full">
                {t("booking.cancel")}
              </button>
            </div>
          </aside>
        </div>
      )}
    </Modal>
  );
}
