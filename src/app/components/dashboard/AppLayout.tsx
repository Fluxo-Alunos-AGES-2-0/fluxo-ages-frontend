import { Navigate, Outlet } from "react-router";
import { AuthProvider } from "@/app/context/AuthContext";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { TimerProvider } from "@/app/context/TimerContext";
import { OnboardingProvider } from "@/app/components/Onboarding/OnboardingContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppLayout() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <TimerProvider>
          <OnboardingProvider>
            <div className="grid grid-cols-[272px_1fr] h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col h-screen overflow-hidden">
                <TopBar />
                <div className="flex-1 p-6 overflow-y-auto bg-[#f3f4f6] dark:bg-[#0F172A]">
                  <Outlet />
                </div>
              </div>
            </div>
          </OnboardingProvider>
        </TimerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}