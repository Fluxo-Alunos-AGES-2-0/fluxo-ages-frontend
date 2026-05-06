import { api } from "../services/api";
import { useEffect, useState } from "react";
import { FileText, Download, ChevronDown } from "lucide-react";
import { HoursTable } from "../components/reports/HoursTable";
import { HoursSummary } from "../components/reports/HoursSummary";

type TabId = "horas" | "sprint" | "andamento" | "final";

interface HourEntry {
  id: number;
  startTime: string;
  totalTimeSeconds: number;
  description: string;
  status?: "VALIDO" | "INVALIDO" | "REQUISITADO";
}

interface Tab {
  id: TabId;
  label: string;
  hasProjectFilter: boolean;
}

const TABS: Tab[] = [
  { id: "horas", label: "Horas", hasProjectFilter: true },
  { id: "sprint", label: "Sprint", hasProjectFilter: true },
  { id: "andamento", label: "Andamento", hasProjectFilter: false },
  { id: "final", label: "Final", hasProjectFilter: false },
];

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<TabId>("horas");
  const [selectedProject, setSelectedProject] = useState("");
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get<HourEntry[]>("/hours/me")
      .then((data) => {
        if (cancelled) return;
        setHours(data ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Erro ao buscar horas:", err);
        setError("Não foi possível carregar os registros de horas.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="flex flex-col gap-5">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2.5">
        <FileText size={20} className="text-[#3b5ccc]" strokeWidth={1.8} />
        <h2 className="text-[18px] font-bold text-[#1f2937] m-0 leading-none">
          Relatórios
        </h2>
      </div>

      {/* Card container */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        {/* Barra de abas */}
        <div className="flex items-center border-b border-[#e5e7eb] px-6">
          <nav className="flex flex-1 gap-1" role="tablist">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative px-4 py-4 text-[14px] font-medium transition-colors focus:outline-none",
                    isActive
                      ? "text-[#3b5ccc]"
                      : "text-[#6b7280] hover:text-[#374151]",
                  ].join(" ")}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b5ccc] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Ícone de download */}
          <button
            aria-label="Baixar relatório"
            className="
              w-[34px] h-[34px] flex items-center justify-center
              rounded-lg border border-[#e5e7eb] text-[#6b7280]
              hover:bg-[#f3f4f6] hover:text-[#3b5ccc] transition-colors
            "
          >
            <Download size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Filtro compartilhado (Horas + Sprint) */}
        {currentTab.hasProjectFilter && (
          <div className="px-6 pt-5">
            <div className="relative">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="
                  appearance-none h-[38px] pl-4 pr-9 rounded-lg
                  border border-[#e5e7eb] bg-white
                  text-[13px] text-[#6b7280] font-medium
                  focus:outline-none focus:ring-2 focus:ring-[#3b5ccc]/30 focus:border-[#3b5ccc]
                  cursor-pointer transition-colors
                "
              >
                <option value="">Filtrar por projeto</option>
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
              />
            </div>
          </div>
        )}

        {/* Slot – cada aba renderiza seu componente filho */}
        <div role="tabpanel" className="p-6">
          {activeTab === "horas" && (
            <>
              {loading && (
                <div className="text-center text-[#6b7280] py-10">
                  Carregando registros...
                </div>
              )}
              {!loading && error && (
                <div className="text-center text-red-600 py-10">{error}</div>
              )}
              {!loading && !error && (
                <>
                  <HoursSummary data={hours} />
                  <HoursTable data={hours} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
