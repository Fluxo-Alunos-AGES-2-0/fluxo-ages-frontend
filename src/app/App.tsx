import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      <RouterProvider router={router} />
    </>
  );
}