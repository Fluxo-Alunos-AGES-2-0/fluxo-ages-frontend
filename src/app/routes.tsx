import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { AppLayout } from "./components/dashboard/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PasswordRecovery from "./components/passwordRecovery/PasswordRecovery";
import RelatoriosPage from "./pages/RelatoriosPage";

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  { path: "/recuperar-senha", Component: PasswordRecovery },
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
      { path: "relatorios", Component: RelatoriosPage },
    ],
  },
]);
