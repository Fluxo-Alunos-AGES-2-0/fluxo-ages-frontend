import { Info, Sun, RefreshCw } from "lucide-react";
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
  const navigate = useNavigate();
  const title = pathname.startsWith("/projetos/")
    ? "Mapa de Projetos > Detalhes do Projeto"
    : pageTitles[pathname] || "Dashboard";
  const showTimerWidget = pathname !== "/dashboard";
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-7 h-[72px] shrink-0 bg-white border-b border-[#e5e7eb]">
        <div className="flex-1">
          <h1 className="text-[16px] font-semibold text-[#1f2937] m-0">
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
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full border-[1.5px] border-[#e5e7eb] bg-transparent text-[#6b7280] cursor-pointer hover:bg-[#eef1fb] hover:text-[#3b5ccc] hover:border-[#3b5ccc] transition-colors"
            aria-label="Refazer o tour"
          >
            <RefreshCw size={15} />
          </button>

          <button
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full border-[1.5px] border-[#e5e7eb] bg-transparent text-[#6b7280] cursor-pointer hover:bg-gray-50 transition-colors"
            aria-label="Informações"
            onClick={() => navigate("/sobre")}
          >
            <Info size={18} />
          </button>

          <div className="w-[50px] h-[28px] rounded-full bg-[#e5e7eb] flex items-center p-[3px] cursor-pointer">
            <div className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center text-[#f47b20] shadow-sm">
              <Sun size={14} />
            </div>
          </div>
        </div>
      </header>

      <ResetOnboardingModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </>
  );
}
