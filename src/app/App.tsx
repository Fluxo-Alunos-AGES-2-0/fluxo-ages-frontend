import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";
import { TeacherFeedbackModal } from "./components/reports/TeacherFeedbackModal"; // 1. Adicione o import

export default function App() {
  return (
    <>
    <TeacherFeedbackModal 
        isOpen={true} // Força ele a ficar aberto na tela sem precisar logar
        onClose={() => console.log("Fechando...")} 
        reportData={{
           }}
      />
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      <RouterProvider router={router} />
    </>
  );
}