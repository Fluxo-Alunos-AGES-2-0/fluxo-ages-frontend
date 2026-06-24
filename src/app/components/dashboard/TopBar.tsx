import { Info, Sun, Moon, RefreshCw } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import { useLocation, useNavigate } from "react-router";
import { HeaderTimerWidget } from "./HeaderTimerWidget";
import { useState } from "react";
import { ResetOnboardingModal } from "@/app/components/Onboarding/ResetOnboardingModal";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/relatorios": "Relatórios",
  "/projetos": "Mapa de Projetos",
  "/sobre": "Sobre",
};

export function TopBar() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const title = pathname.startsWith("/projetos/")
    ? "Mapa de Projetos > Detalhes do Projeto"
    : pageTitles[pathname] || "Dashboard";
  const showTimerWidget = pathname !== "/dashboard";
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-7 h-[72px] shrink-0 bg-white dark:bg-[#1A2438] border-b border-[#e5e7eb] dark:border-[#31405A]">
        <div className="flex-1">
          <h1 className="text-[16px] font-semibold text-[#1f2937] dark:text-[#F3F4F6] m-0">
            {title}
          </h1>
        </div>

        {/* Renderização condicional do Widget */}
        {showTimerWidget && <HeaderTimerWidget />}

        <div className="flex-1 flex items-center justify-end gap-3">
          {/* Refazer Tour button */}
          <button
            onClick={() => setShowResetModal(true)}
            title="Refazer o tour de introdução"
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full border-[1.5px] border-[#e5e7eb] dark:border-[#31405A] bg-transparent text-[#6b7280] dark:text-[#98A3B8] cursor-pointer hover:bg-[#eef1fb] dark:hover:bg-[#253657] hover:text-[#3b5ccc] dark:hover:text-[#4E6CFF] hover:border-[#3b5ccc] dark:hover:border-[#4E6CFF] transition-colors"
            aria-label="Refazer o tour"
          >
            <RefreshCw size={15} />
          </button>

          <button
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full border-[1.5px] border-[#e5e7eb] dark:border-[#31405A] bg-transparent text-[#6b7280] dark:text-[#98A3B8] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#253657] hover:text-[#3b5ccc] dark:hover:text-[#4E6CFF] transition-colors"
            aria-label="Informações"
            onClick={() => navigate("/sobre")}
          >
            <Info size={18} />
          </button>

          <button
            onClick={toggleTheme}
            className="w-[50px] h-[28px] rounded-full bg-[#e5e7eb] dark:bg-[#4E6CFF] flex items-center p-[3px] cursor-pointer transition-colors"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            <div
              className={`w-[22px] h-[22px] rounded-full bg-white dark:bg-white flex items-center justify-center shadow-sm transition-all ${
                theme === "dark"
                  ? "translate-x-[22px] text-[#4E6CFF]"
                  : "translate-x-0 text-[#f47b20]"
              }`}
            >
              {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
            </div>
          </button>
        </div>
      </header>

      <ResetOnboardingModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </>
  );
}
