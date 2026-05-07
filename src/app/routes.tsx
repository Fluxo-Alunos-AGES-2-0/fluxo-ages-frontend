import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { AppLayout } from "./components/dashboard/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PasswordRecovery from "./components/passwordRecovery/PasswordRecovery";
import RelatoriosPage from "./pages/RelatoriosPage";
import { ReportUploadModal } from "./components/reports/ReportUploadModal";

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  //{ path: "/login", element: <ReportUploadModal isOpen={true} /> },
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
