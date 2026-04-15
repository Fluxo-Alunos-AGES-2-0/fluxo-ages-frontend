import { Navigate, Outlet } from "react-router";
import { AuthProvider } from "../../context/AuthContext";
import { ThemeProvider } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./layout.module.css";

export default function Layout() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className={styles.shell}>
          <Sidebar />
          <div className={styles.main}>
            <Header />
            <div className={styles.content}>
              <Outlet />
            </div>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
