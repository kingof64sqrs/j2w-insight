import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
  ready: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "j2w_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const login = async (email: string, _password: string) => {
    const u: User = { email, name: email.split("@")[0] || "HRBP User", role: "HRBP" };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };
  const loginDemo = () => {
    const u: User = { email: "demo@j2w.io", name: "Priya Mehta", role: "Senior HRBP" };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, loginDemo, logout, ready }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}

export function isAuthed() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(KEY);
}
