import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { api } from "@/app/services/api";
import { toAgesLevel } from "@/app/utils/agesLevel";
import type { ProfileData } from "@/app/types/dashboard";

export interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: string;
  level: string;
  avatarUrl: string;
  diaTurno: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return {
      id: Number(payload.sub),
      name: payload.name ?? "",
      initials: toInitials(payload.name ?? ""),
      email: "",
      role: payload.role ?? "",
      level: "",
      avatarUrl: "",
      // TODO: o backend ainda não inclui diaTurno no JWT. Quando incluir, a
      // sidebar passa a usar o turno real do aluno automaticamente.
      diaTurno: payload.diaTurno ?? ""
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!token);
  const [user, setUser] = useState<User | null>(() =>
    token ? decodeToken(token) : null,
  );
  const navigate = useNavigate();

  const refreshUserProfile = async () => {
    const profile = await api.get<ProfileData>("/students/me");
    setUser((prev) =>
      prev
        ? {
            ...prev,
            email: profile.email ?? prev.email,
            level: toAgesLevel(profile.agesLevel),
            avatarUrl: profile.avatarUrl ?? "",
          }
        : prev,
    );
  };

  useEffect(() => {
    if (!token) return;

    refreshUserProfile().catch(() => {
      // Keep JWT-derived user data when the profile endpoint is temporarily unavailable.
    });
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : null));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, logout, updateUser, refreshUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
