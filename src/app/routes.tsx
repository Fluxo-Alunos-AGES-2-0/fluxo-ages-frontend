import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { AppLayout } from "./components/dashboard/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import PasswordRecovery from "./components/passwordRecovery/PasswordRecovery";
import { ProjetosPage } from "./pages/ProjetosPage";
import ProjetoDetalhesPage from "./pages/ProjetoDetalhesPage";
import SobrePage from "./pages/SobrePage";
import UnexpectedError from "./components/UnexpectedError";
import { InDevelopmentPage } from './pages/InDevelopmentPage';

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
      { path: "projetos/:id", Component: ProjetoDetalhesPage },
      { path: "sobre", Component: SobrePage },
      { path: "em-desenvolvimento", Component: InDevelopmentPage },
    ],
  },
]);
