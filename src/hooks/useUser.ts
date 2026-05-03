import { useEffect, useState } from "react";
import { store } from "../lib/store";
import type { User } from "../lib/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(() => store.getCurrentUser());

  useEffect(() => {
    const handler = () => setUser(store.getCurrentUser());
    window.addEventListener("skillaura:user", handler);
    return () => window.removeEventListener("skillaura:user", handler);
  }, []);

  return user;
}
