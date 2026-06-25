import { useState } from "react";
import { Download, MessageSquare } from "lucide-react";
import { TeacherFeedbackModal } from "./TeacherFeedbackModal";
import { resolveFileUrl } from "../../services/api";

export interface ReportFeedback {
  comment: string | null;
  correctionUrl?: string | null;
  revisionDate?: string | null;
  teacherName?: string | null;
}

export interface ReportEntry {
  date: string;
  project: string;
  grade: number;
  feedback: ReportFeedback | null;
  urlArchive?: string | null;
}

interface GenericReportsTableProps {
  data: ReportEntry[];
}

export function GenericReportsTable({ data }: GenericReportsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportEntry | null>(
    null,
  );

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-[#6b7280] dark:text-[#94A3B8] py-10">
        Nenhum relatório encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#e5e7eb] dark:border-[#31405A] rounded-xl">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-[#f9fafb] dark:bg-[#1A2438] border-b border-[#e5e7eb] dark:border-[#31405A]">
            <th className="w-[22%] px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280] dark:text-[#94A3B8]">
              Data de criação
            </th>

            <th className="w-[38%] px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280] dark:text-[#94A3B8]">
              Projeto
            </th>

            <th className="w-[14%] px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280] dark:text-[#94A3B8]">
              Nota
            </th>

            <th className="w-[13%] px-6 py-4 text-center text-[13px] font-semibold text-[#6b7280] dark:text-[#94A3B8]">
              Feedback
            </th>

            <th className="w-[13%] px-6 py-4 text-center text-[13px] font-semibold text-[#6b7280] dark:text-[#94A3B8]">
              Download
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#31405A]">
          {data.map((report, index) => (
            <tr
              key={`${report.date}-${report.project}-${index}`}
              className="hover:bg-gray-50 dark:hover:bg-[#253657] transition-colors"
            >
              <td className="px-6 py-4 text-[14px] text-[#374151] dark:text-[#F4F6F7]">
                {report.date}
              </td>

              <td className="px-6 py-4 text-[14px] text-[#374151] dark:text-[#F4F6F7] font-medium truncate">
                {report.project}
              </td>

              <td className="px-6 py-4 text-[14px] text-[#374151] dark:text-[#F4F6F7]">
                {report.grade?.toFixed(1) ?? "-"}
              </td>

              <td className="px-6 py-4 text-center">
                {report.feedback?.comment ? (
                  <button
                    type="button"
                    title="Ver feedback"
                    onClick={() => {
                      setSelectedReport(report);
                      setIsModalOpen(true);
                    }}
                    className="text-[#3b5ccc] dark:text-[#4E6CFF] cursor-pointer hover:text-[#2a459c] transition-colors"
                  >
                    <MessageSquare size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    title="Nenhum feedback foi enviado ainda"
                    className="text-[#3b5ccc] dark:text-[#4E6CFF] opacity-50 cursor-not-allowed"
                  >
                    <MessageSquare size={20} />
                  </button>
                )}
              </td>

              <td className="px-6 py-4 text-center">
                {report.urlArchive ? (
                  <a
                    href={resolveFileUrl(report.urlArchive)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Baixar relatório"
                    className="inline-flex text-[#3b5ccc] dark:text-[#4E6CFF] hover:text-[#2a459c] transition-colors"
                  >
                    <Download size={20} />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    title="Sem arquivo disponível"
                    className="text-[#3b5ccc] dark:text-[#4E6CFF] opacity-50 cursor-not-allowed"
                  >
                    <Download size={20} />
                  </button>
                )}
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