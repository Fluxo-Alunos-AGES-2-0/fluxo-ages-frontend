import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
]);
