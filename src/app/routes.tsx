import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { AppLayout } from "./components/dashboard/AppLayout";
import DashboardPage from "./pages/DashboardPage";

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
    ],
  },
]);
