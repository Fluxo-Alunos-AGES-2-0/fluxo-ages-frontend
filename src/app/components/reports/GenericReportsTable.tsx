// components/reports/GenericReportsTable.tsx
import { Download, MessageSquare } from "lucide-react";

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
  return (
    <div className="overflow-hidden border border-[#e5e7eb] rounded-xl">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
            <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280]">Data de criação</th>
            <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280]">Projeto</th>
            <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6b7280]">Nota</th>
            <th className="px-6 py-4 text-center text-[13px] font-semibold text-[#6b7280]">Feedback</th>
            <th className="px-6 py-4 text-center text-[13px] font-semibold text-[#6b7280]">Download</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e7eb]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-[#9ca3af] italic">
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((report, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-[14px] text-[#374151]">{report.date}</td>
                <td className="px-6 py-4 text-[14px] text-[#374151] font-medium">{report.project}</td>
                <td className="px-6 py-4 text-[14px] text-[#374151]">{report.grade.toFixed(1)}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-[#3b5ccc] hover:opacity-70 hover:cursor-pointer transition-opacity">
                    <MessageSquare size={20} />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-[#3b5ccc] hover:opacity-70 hover:cursor-pointer transition-opacity">
                    <Download size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}