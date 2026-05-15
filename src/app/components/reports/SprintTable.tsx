import { useEffect, useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  SprintReportModal,
  type SprintReportFormData,
} from "./SprintReportModal";

interface SprintReportApiResponse {
  id: number;
  sprint: string;
  student: string;
  date: string;
  id_project: number;
}

type RowStatus = "ENVIANDO" | "ENVIADO";

interface SprintReportRow extends SprintReportApiResponse {
  status: RowStatus;
}

interface SprintReportPayload {
  sprint: number;
  predictedActivity: string;
  activityCompleted: string;
  problemsEncountered: string;
  learnedLessons: string;
  nextSteps: string;
}

function parseSprintNumber(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : NaN;
}

function toPayload(data: SprintReportFormData): SprintReportPayload {
  return {
    sprint: parseSprintNumber(data.sprint),
    predictedActivity: data.plannedActivities,
    activityCompleted: data.completedActivities,
    problemsEncountered: data.problems,
    learnedLessons: data.lessonsLearned,
    nextSteps: data.nextSteps,
  };
}

interface SprintTableProps {
  selectedProject?: number | null;
}

export function SprintTable({ selectedProject = null }: SprintTableProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sprintReports, setSprintReports] = useState<SprintReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchReports = () => {
    setLoading(true);
    setError(null);
    const path =
      selectedProject == null
        ? "/report/me/sprint"
        : `/report/me/sprint?projectId=${selectedProject}`;
    api
      .get<SprintReportApiResponse[]>(path)
      .then((data) =>
        setSprintReports(
          (data ?? []).map((r) => ({ ...r, status: "ENVIADO" as const })),
        ),
      )
      .catch((err) => {
        console.error("Erro ao buscar relatórios de sprint:", err);
        setError("Não foi possível carregar os relatórios de sprint.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  const handleSubmit = async (data: SprintReportFormData) => {
    const optimisticId = -Date.now();
    const optimisticRow: SprintReportRow = {
      id: optimisticId,
      sprint: data.sprint,
      student: user?.name ?? "",
      date: new Date().toISOString(),
      id_project: 0,
      status: "ENVIANDO",
    };

    setSprintReports((prev) => [...prev, optimisticRow]);
    setIsModalOpen(false);
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await api.post("/report/sprint", toPayload(data));
      showToast({
        variant: "success",
        title: "Relatório enviado",
        message: "Relatório de sprint registrado com sucesso.",
      });
      fetchReports();
    } catch (err) {
      setSprintReports((prev) => prev.filter((r) => r.id !== optimisticId));
      const message =
        err instanceof Error ? err.message : "Erro ao enviar relatório.";
      showToast({
        variant: "error",
        title: "Erro ao enviar",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3b5ccc] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f4bb0] transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Novo Relatório
        </button>
      </div>

      {loading ? (
        <div className="text-center text-[#6b7280] py-10">
          Carregando relatórios...
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : sprintReports.length === 0 ? (
        <div className="text-center text-[#6b7280] py-10">
          Nenhum relatório de sprint encontrado.
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-[#eef0f4]">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#f9fafb] text-[#6b7280] border-b border-[#eef0f4]">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Sprint</th>
                <th className="px-6 py-4 text-left font-semibold">Aluno</th>
                <th className="px-6 py-4 text-left font-semibold">Data</th>
                <th className="px-6 py-4 text-center font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {sprintReports.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#eef0f4] hover:bg-slate-50/30 transition-colors last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {item.sprint}
                  </td>

                  <td className="px-6 py-4 text-slate-600">{item.student}</td>

                  <td className="px-6 py-4 text-slate-600">
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {item.status === "ENVIANDO" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-bold text-blue-600">
                        <LoaderCircle size={13} className="animate-spin" />
                        Enviando
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 text-xs font-bold text-[#22c55e]">
                        Enviado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SprintReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        usedSprints={sprintReports.map((r) => r.sprint)}
      />
    </>
  );
}
