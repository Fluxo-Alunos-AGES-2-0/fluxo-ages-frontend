import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TimerProvider } from "./context/TimerContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FloatingTimerWidget } from "./components/dashboard/FloatingTimerWidget";

export default function App() {
  return (
    <ThemeProvider>
      <TimerProvider>
        {/* Global floating timer — rendered above every route */}
        <FloatingTimerWidget />
        <RouterProvider router={router} />
      </TimerProvider>
    </ThemeProvider>
  );
}
