import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
