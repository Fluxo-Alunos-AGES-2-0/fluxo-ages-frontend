import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router";

export interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: string;
  level: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
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
    return {
      id: Number(payload.sub),
      name: payload.name ?? "",
      initials: toInitials(payload.name ?? ""),
      email: "",
      role: payload.role ?? "",
      level: "",
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
    <AuthContext.Provider value={{ isAuthenticated, user, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
