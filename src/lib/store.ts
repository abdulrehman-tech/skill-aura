import type { Session, User } from "./types";
import { users as seedUsers } from "../data/users";
import { sessions as seedSessions } from "../data/sessions";

const KEY = {
  user: "skillaura.currentUser",
  sessions: "skillaura.sessions",
  users: "skillaura.users",
  theme: "skillaura.theme",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getCurrentUser(): User | null {
    return read<User | null>(KEY.user, null);
  },
  setCurrentUser(user: User | null) {
    if (user) write(KEY.user, user);
    else localStorage.removeItem(KEY.user);
    window.dispatchEvent(new Event("skillaura:user"));
  },
  getUsers(): User[] {
    const stored = read<User[] | null>(KEY.users, null);
    if (stored && stored.length) return stored;
    write(KEY.users, seedUsers);
    return seedUsers;
  },
  updateUser(user: User) {
    const all = this.getUsers().map((u) => (u.id === user.id ? user : u));
    write(KEY.users, all);
    const cur = this.getCurrentUser();
    if (cur && cur.id === user.id) this.setCurrentUser(user);
  },
  getSessions(): Session[] {
    const stored = read<Session[] | null>(KEY.sessions, null);
    if (stored) return stored;
    write(KEY.sessions, seedSessions);
    return seedSessions;
  },
  saveSessions(list: Session[]) {
    write(KEY.sessions, list);
    window.dispatchEvent(new Event("skillaura:sessions"));
  },
  addSession(s: Session) {
    const list = [s, ...this.getSessions()];
    this.saveSessions(list);
  },
  reset() {
    Object.values(KEY).forEach((k) => localStorage.removeItem(k));
    window.dispatchEvent(new Event("skillaura:user"));
    window.dispatchEvent(new Event("skillaura:sessions"));
  },
  getTheme(): "light" | "dark" {
    return read<"light" | "dark">(KEY.theme, "light");
  },
  setTheme(t: "light" | "dark") {
    write(KEY.theme, t);
    document.documentElement.classList.toggle("dark", t === "dark");
  },
};
