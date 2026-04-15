import { Info, Sun } from "lucide-react";
import { useLocation } from "react-router";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/relatorios": "Relatórios",
  "/projetos": "Mapa de Projetos",
};

export function TopBar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="flex items-center justify-between px-7 h-[72px] shrink-0 bg-white border-b border-[#e5e7eb]">
      <div className="flex-1">
        <h1 className="text-[16px] font-semibold text-[#1f2937] m-0">
          {title}
        </h1>
      </div>

      {/* Timer slot - reserved for FLU-57 */}
      <div className="flex-1 flex justify-center" />

      <div className="flex-1 flex items-center justify-end gap-3">
        <button
          className="w-[30px] h-[30px] flex items-center justify-center rounded-full border-[1.5px] border-[#e5e7eb] bg-transparent text-[#6b7280] cursor-pointer hover:bg-gray-50 transition-colors"
          aria-label="Informações"
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
  );
}
