
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { ToastProvider } from "./app/context/ToastContext.tsx";
  import { ToastContainer } from "./app/components/ui/Toast/Toast.tsx";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <App />
    <ToastContainer />
  </ToastProvider>
);
 