import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
  SprintReportModal,
  type SprintReportFormData,
} from "./SprintReportModal";

export interface SprintReport {
  id: number;
  sprint: string;
  student: string;
  date: string;
  id_project: number;
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

export function SprintTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sprintReports, setSprintReports] = useState<SprintReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchReports = () => {
    setLoading(true);
    setError(null);
    api
      .get<SprintReport[]>("/report/me/sprint")
      .then((data) => setSprintReports(data ?? []))
      .catch((err) => {
        console.error("Erro ao buscar relatórios de sprint:", err);
        setError("Não foi possível carregar os relatórios de sprint.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (data: SprintReportFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/report/sprint", toPayload(data));
      showToast({
        variant: "success",
        title: "Relatório enviado",
        message: "Relatório de sprint registrado com sucesso.",
      });
      setIsModalOpen(false);
      fetchReports();
    } catch (err) {
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
