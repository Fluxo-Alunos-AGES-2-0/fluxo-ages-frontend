import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
    ],
  },
]);
