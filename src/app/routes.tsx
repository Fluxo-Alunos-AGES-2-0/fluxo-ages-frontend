import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { AppLayout } from "./components/dashboard/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import PasswordRecovery from "./components/passwordRecovery/PasswordRecovery";
import { ProjetosPage } from "./pages/ProjetosPage";
import UnexpectedError from './components/UnexpectedError';

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  { path: "/reset-password", Component: PasswordRecovery },
  {
    path: "/",
    Component: AppLayout,
    ErrorBoundary: UnexpectedError,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
      { path: "relatorios", Component: RelatoriosPage },
      { path: "projetos", Component: ProjetosPage },
    ],
  },
]);
