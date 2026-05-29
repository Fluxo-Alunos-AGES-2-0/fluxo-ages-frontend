import { useState } from "react";
import { Download, MessageSquare } from "lucide-react";
import { TeacherFeedbackModal } from "./TeacherFeedbackModal";

export interface ReportEntry {
  date: string;
  project: string;
  grade: number;
  feedback: string;
}

interface GenericReportsTableProps {
  data: ReportEntry[];
}

export function GenericReportsTable({ data }: GenericReportsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportEntry | null>(null);
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-[#6b7280] py-10">
        Nenhum relatório encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#e5e7eb] rounded-xl">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
            <th className="w-[22%] px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280]">
              Data de criação
            </th>

            <th className="w-[38%] px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280]">
              Projeto
            </th>

            <th className="w-[14%] px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280]">
              Nota
            </th>

            <th className="w-[13%] px-6 py-4 text-center text-[13px] font-semibold text-[#6b7280]">
              Feedback
            </th>

            <th className="w-[13%] px-6 py-4 text-center text-[13px] font-semibold text-[#6b7280]">
              Download
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e5e7eb]">
          {data.map((report, index) => (
            <tr
              key={`${report.date}-${report.project}-${index}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-[14px] text-[#374151]">
                {report.date}
              </td>

              <td className="px-6 py-4 text-[14px] text-[#374151] font-medium truncate">
                {report.project}
              </td>

              <td className="px-6 py-4 text-[14px] text-[#374151]">
                {report.grade?.toFixed(1) ?? "-"}
              </td>

             <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  title="Ver feedback"
                  onClick={() => {
                    setSelectedReport(report);
                    setIsModalOpen(true);
                  }}
                  className="text-[#3b5ccc] hover:text-[#2a459c] transition-colors"
                >
                  <MessageSquare size={20} />
                </button>
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  title="Baixar correção"
                  onClick={() => alert("Download da correção iniciado!")}
                  className="text-[#3b5ccc] hover:text-[#2a459c] transition-colors"
                >
                  <Download size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
      <TeacherFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportData={selectedReport}
      />
    </div>
  );
}
