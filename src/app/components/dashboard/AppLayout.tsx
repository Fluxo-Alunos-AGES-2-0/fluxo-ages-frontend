import { Navigate, Outlet } from "react-router";
import { AuthProvider } from "@/app/context/AuthContext";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppLayout() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="grid grid-cols-[272px_1fr] min-h-screen">
          <Sidebar />
          <div className="grid grid-rows-[64px_1fr] min-h-screen">
            <TopBar />
            <div className="p-6 overflow-y-auto bg-[#f3f4f6]">
              <Outlet />
            </div>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
