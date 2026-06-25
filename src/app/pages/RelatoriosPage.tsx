import { api } from "../services/api";
import { useEffect, useState } from "react";
import { FileText, FileDown, UploadCloud, Plus } from "lucide-react";
import { HoursTable } from "../components/reports/HoursTable";
import { HoursSummary } from "../components/reports/HoursSummary";
import {
  GenericReportsTable,
  type ReportEntry,
} from "../components/reports/GenericReportsTable";
import { Button } from "../components/ui/Button/Button";
import { ReportUploadModal } from "../components/reports/ReportUploadModal";
import { SprintTable } from "../components/reports/SprintTable";
import { Select } from "../components/ui/Select/Select";
import { useToast } from "../context/ToastContext";
import { OnboardingTooltip } from "../components/Onboarding/OnboardingTooltip";
import { usePageOnboarding } from "../components/Onboarding/usePageOnboarding";

type TabId = "horas" | "sprint" | "andamento" | "final";

interface HourEntry {
  id: number;
  startTime: string;
  sessionTimeSeconds: number;
  activities: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  rejectionJustification?: string | null;
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

interface ReportFeedbackApiResponse {
  comment: string | null;
  correctionUrl: string | null;
  revisionDate: string | null;
  teacherName: string | null;
}

interface ReportApiResponse {
  date: string;
  project: string;
  grade: number;
  feedback: ReportFeedbackApiResponse | null;
  urlArchive: string | null;
}

interface ProjectOption {
  id: number;
  name: string;
}

function toReportEntry(report: ReportApiResponse): ReportEntry {
  return {
    date: new Date(report.date).toLocaleDateString("pt-BR"),
    project: report.project,
    grade: report.grade,
    feedback: report.feedback,
    urlArchive: report.urlArchive ?? null,
  };
}

const RELATORIOS_STEPS = [
  {
    target: "[data-onboarding='report-tabs']",
    title: "Abas de Relatórios",
    description:
      "Navegue entre as quatro categorias: Horas (seus registros de tempo), Sprint (entregas por sprint), Andamento (relatórios intermediários) e Final.",
    placement: "bottom" as const,
  },
  {
    target: "[data-onboarding='report-project-filter']",
    title: "Filtro por Projeto",
    description:
      "Selecione um projeto específico para filtrar os registros de horas e relatórios de sprint.",
    placement: "bottom" as const,
  },
  {
    target: "[data-onboarding='report-hours-summary']",
    title: "Resumo de Horas",
    description:
      "Veja o total de horas aprovadas, pendentes e rejeitadas do projeto selecionado em um resumo rápido antes da tabela detalhada.",
    placement: "bottom" as const,
  },
  {
    target: "[data-onboarding='report-table']",
    title: "Tabela de Registros",
    description:
      "Cada linha representa uma sessão de trabalho. Registros pendentes aguardam aprovação do professor; rejeitados mostram a justificativa ao clicar.",
    placement: "top" as const,
  },
];

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<TabId>("horas");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [progressReport, setProgressReport] = useState<ReportEntry[]>([]);
  const [finalReport, setFinalReport] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showToast } = useToast();
  const currentProject = projects[0] ?? null;

  usePageOnboarding("relatorios", RELATORIOS_STEPS);

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const blob = await api.blob("/report/template");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "modelo-relatorio.docx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao baixar o modelo.";
      showToast({ variant: "error", title: "Erro ao baixar", message });
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  useEffect(() => {
    api
      .get<ProjectOption[]>("/projects")
      .then((data) => {
        const list = data ?? [];
        setProjects(list);
        if (list.length > 0) {
          setSelectedProject(list[0].id);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar projetos:", err);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (activeTab === "horas") {
      setLoading(true);
      setError(null);
      const path =
        selectedProject == null
          ? "/hours/me"
          : `/hours/me?id_project=${selectedProject}`;
      api
        .get<HourEntry[]>(path)
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
  }, [activeTab, refreshKey, selectedProject]);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const isCurrentProjectSelected =
    currentProject == null || selectedProject === currentProject.id;

  const renderReportTab = (data: ReportEntry[]) => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] dark:border-[#334155] pb-4">
        <div className="relative">
          <Button
            variant="secondary"
            onClick={handleDownloadTemplate}
            loading={isDownloadingTemplate}
            disabled={isDownloadingTemplate}
            className="flex items-center gap-2 text-[#3b5ccc] dark:text-[#3B5CCC] font-bold text-[15px] px-1 border-1 border-[#3b5ccc] dark:border-[#3B5CCC] bg-transparent hover:bg-[#3b5ccc]"
          >
            <FileDown size={20} strokeWidth={2.5} />
            Modelo de Relatório
          </Button>
        </div>

        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-[#3B5CCC] text-white px-5 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#2f4bb0] transition-colors shadow-sm"
          >
          <UploadCloud size={18} />
          Enviar Relatório
        </Button>
      </div>

      {loading && (
        <div className="text-center text-[#6b7280] dark:text-[#94A3B8] py-10">
          Carregando registros...
        </div>
      )}
      {!loading && error && (
        <div className="text-center text-red-600 dark:text-red-400 py-10">{error}</div>
      )}
      {!loading && !error && <GenericReportsTable data={data} />}
    </div>
  );

  return (
    <>
      <OnboardingTooltip steps={RELATORIOS_STEPS} />

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <FileText size={20} className="text-[#3b5ccc] dark:text-[#4E6CFF]" strokeWidth={1.8} />
          <h2 className="text-[18px] font-bold text-[#1f2937] dark:text-[#F4F6F7] m-0 leading-none">
            Relatórios
          </h2>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#e5e7eb] dark:border-[#334155]">
          <div
            className="flex items-center border-b border-[#e5e7eb] dark:border-[#334155] px-6 bg-white dark:bg-[#1E293B] rounded-t-2xl"
            data-onboarding="report-tabs"
          >
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
                        ? "text-[#3b5ccc] dark:text-[#3B5CCC]"
                        : "text-[#6b7280] dark:text-[#94A3B8] hover:text-[#374151] dark:hover:text-[#F4F6F7]",
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
          </div>

          {currentTab.hasProjectFilter && (
            <div
              className="px-6 pt-5 flex items-center justify-between"
              data-onboarding="report-project-filter"
            >
              <Select
                wrapperClassName="w-[220px]"
                className="w-[220px]"
                value={selectedProject ?? ""}
                onChange={(e) =>
                  setSelectedProject(
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="Filtrar por projeto"
                options={projects.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
              />

              {activeTab === "sprint" && isCurrentProjectSelected && (
                <button
                  type="button"
                  onClick={() => setIsSprintModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3b5ccc] px-4 py-2 text-sm font-medium text-white hover:bg-[#4c6ef5] transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                  Novo Relatório
                </button>
              )}
            </div>
          )}

          <div role="tabpanel" className="p-6">
            {activeTab === "horas" && (
              <>
                {loading && (
                  <div className="text-center text-[#6b7280] dark:text-[#94A3B8] py-10">
                    Carregando registros...
                  </div>
                )}
                {!loading && error && (
                  <div className="text-center text-red-600 dark:text-red-400 py-10">{error}</div>
                )}
                {!loading && !error && (
                  <>
                    <div data-onboarding="report-hours-summary">
                      <HoursSummary
                        data={hours}
                        isCurrentProject={isCurrentProjectSelected}
                      />
                    </div>
                    <div data-onboarding="report-table">
                      <HoursTable
                        data={hours}
                        onChanged={() => setRefreshKey((k) => k + 1)}
                      />
                    </div>
                  </>
                )}
              </>
            )}
            {activeTab === "sprint" && (
              <SprintTable
                selectedProject={selectedProject}
                currentProjectId={currentProject?.id ?? null}
                currentProjectName={currentProject?.name ?? ""}
                externalModalOpen={isSprintModalOpen}
                onExternalModalClose={() => setIsSprintModalOpen(false)}
              />
            )}
            {activeTab === "andamento" && renderReportTab(progressReport)}
            {activeTab === "final" && renderReportTab(finalReport)}
          </div>
        </div>

        <ReportUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          reportType={activeTab === "final" ? "final" : "andamento"}
          currentProject={currentProject?.name ?? ""}
          hasExistingReport={
            activeTab === "final"
              ? finalReport.length > 0
              : progressReport.length > 0
          }
          onSuccess={() => {
            setRefreshKey((k) => k + 1);
          }}
        />
      </div>
    </>
  );
}
