import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import ProjetosPage from "./pages/ProjetosPage";

export const router = createBrowserRouter([
  { path: "/",           Component: LoginPage },
  { path: "/dashboard",  Component: DashboardPage },
  { path: "/relatorios", Component: RelatoriosPage },
  { path: "/projetos",   Component: ProjetosPage },
]);
