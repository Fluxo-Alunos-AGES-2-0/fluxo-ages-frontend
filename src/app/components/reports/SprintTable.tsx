import { useEffect, useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { SprintReportModal } from "./SprintReportModal";

interface SprintReport {
  id: number;
  sprint: string;
  student: string;
  date: string;
  status: "PROCESSANDO" | "ENVIADO";
}

export function SprintTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sprintReports, setSprintReports] = useState<SprintReport[]>([
    {
      id: 1,
      sprint: "Sprint 1",
      student: "João Silva",
      date: "2024-06-15T14:30:00Z",
      status: "ENVIADO",
    },
    {
      id: 2,
      sprint: "Sprint 2",
      student: "Maria Oliveira",
      date: "2024-06-20T10:00:00Z",
      status: "PROCESSANDO",
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSprintReports((prev) =>
        prev.map((report) =>
          report.status === "PROCESSANDO"
            ? { ...report, status: "ENVIADO" }
            : report
        )
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

      {sprintReports.length === 0 ? (
        <div className="text-center text-[#6b7280] py-10">
          Nenhum relatório de sprint encontrado.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-[#f9fafb] text-[#6b7280] border-b border-[#eef0f4]">
            <tr>
              <th className="px-4 py-3 text-left">Sprint</th>
              <th className="px-4 py-3 text-left">Aluno</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {sprintReports.map((item) => (
              <tr key={item.id} className="border-t border-[#eef0f4]">
                <td className="px-4 py-3 font-medium text-[#374151]">
                  {item.sprint}
                </td>

                <td className="px-4 py-3 text-[#374151]">{item.student}</td>

                <td className="px-4 py-3 text-[#374151]">
                  {new Date(item.date).toLocaleDateString("pt-BR")}
                </td>

                <td className="px-4 py-3">
                  {item.status === "PROCESSANDO" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-600">
                      <LoaderCircle size={13} className="animate-spin" />
                      Enviando
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-600">
                      Enviado
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <SprintReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}