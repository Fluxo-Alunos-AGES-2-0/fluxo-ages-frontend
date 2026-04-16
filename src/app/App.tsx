import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TimerProvider } from "./context/TimerContext";

export default function App() {
  return (
    <TimerProvider>
      <RouterProvider router={router} />
    </TimerProvider>
  );
}
