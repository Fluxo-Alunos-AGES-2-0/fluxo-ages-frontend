import { api } from "../services/api";
import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  ChevronDown,
  FileDown,
  UploadCloud,
} from "lucide-react";
import { HoursTable } from "../components/reports/HoursTable";
import { HoursSummary } from "../components/reports/HoursSummary";
import {
  GenericReportsTable,
  type ReportEntry,
} from "../components/reports/GenericReportsTable";
import { Button } from "../components/ui/Button/Button";
import { ReportUploadModal } from "../components/reports/ReportUploadModal";
import { SprintTable } from "../components/reports/SprintTable";

type TabId = "horas" | "sprint" | "andamento" | "final";

interface HourEntry {
  id: number;
  startTime: string;
  sessionTimeSeconds: number;
  activities: string;
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

interface ReportApiResponse {
  date: string;
  project: string;
  grade: number;
  feedback: string | null;
}

function toReportEntry(report: ReportApiResponse): ReportEntry {
  const [year, month, day] = report.date.split("-");
  return {
    date: `${day}/${month}/${year}`,
    project: report.project,
    grade: report.grade,
    feedback: report.feedback ?? "",
  };
}

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<TabId>("horas");
  const [selectedProject, setSelectedProject] = useState("");
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [progressReport, setProgressReport] = useState<ReportEntry[]>([]);
  const [finalReport, setFinalReport] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (activeTab === "horas") {
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
    }

    if (activeTab === "andamento") {
      setLoading(true);
      setError(null);
      api
        .get<ReportApiResponse[]>("/report/me/progress")
        .then((data) => {
          if (cancelled) return;
          setProgressReport((data ?? []).map(toReportEntry));
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("Erro ao buscar relatórios de andamento:", err);
          setError("Não foi possível carregar os relatórios de andamento.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    if (activeTab === "final") {
      setLoading(true);
      setError(null);
      api
        .get<ReportApiResponse[]>("/report/me/final")
        .then((data) => {
          if (cancelled) return;
          setFinalReport((data ?? []).map(toReportEntry));
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("Erro ao buscar relatórios finais:", err);
          setError("Não foi possível carregar os relatórios finais.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [activeTab, refreshKey]);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const renderReportTab = (data: ReportEntry[]) => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
        <div className="relative">
          <Button
            variant="secondary"
            className="flex items-center gap-2 text-[#3b5ccc] font-bold text-[15px] px-1 rounded-none border-t-0 border-x-0 border-b-2 border-[#3b5ccc] bg-transparent hover:bg-transparent shadow-none"
          >
            <FileDown size={20} strokeWidth={2.5} />
            Modelo de Relatório
          </Button>
        </div>

        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-[#4c6ef5] text-white px-5 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#3b5ccc] transition-colors shadow-sm"
        >
          <UploadCloud size={18} />
          Enviar Relatório
        </Button>
      </div>

      {loading && (
        <div className="text-center text-[#6b7280] py-10">
          Carregando registros...
        </div>
      )}
      {!loading && error && (
        <div className="text-center text-red-600 py-10">{error}</div>
      )}
      {!loading && !error && <GenericReportsTable data={data} />}
    </div>
  );

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
      <div className="bg-white rounded-2xl border border-[#e5e7eb]">
        {/* Barra de abas */}
        <div className="sticky top-0 z-10 flex items-center border-b border-[#e5e7eb] px-6 bg-white rounded-t-2xl">
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
                    "relative px-4 py-4 text-[14px] font-medium transition-colors focus:outline-none cursor-pointer",
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
          {activeTab === "sprint" && <SprintTable />}
          {activeTab === "andamento" && renderReportTab(progressReport)}
          {activeTab === "final" && renderReportTab(finalReport)}
        </div>
      </div>

      <ReportUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        reportType={activeTab === "final" ? "final" : "andamento"}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
