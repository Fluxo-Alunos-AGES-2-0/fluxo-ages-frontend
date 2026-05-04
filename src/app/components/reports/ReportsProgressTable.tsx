import { Download, MessageSquare } from "lucide-react";

interface ProgressReportEntry {
    "date": string;
    "project": string;
    "grade": number;
    "feedback": string;
}

interface ReportsProgressTableProps {
  data: ProgressReportEntry[];
}

export function ReportsProgressTable({ data }: ReportsProgressTableProps) {

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
          {data.map((report) => (
            <tr key={report.project} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-[14px] text-[#374151] font-semibold">{report.date}</td>
              <td className="px-6 py-4 text-[14px] text-[#374151] font-medium">{report.project}</td>
              <td className="px-6 py-4 text-[14px] text-[#374151]">{report.grade}</td>
              <td className="px-6 py-4 text-center">
                <button className="text-[#3b5ccc] hover:opacity-70 transition-opacity cursor-pointer">
                  <MessageSquare size={20} />
                </button>
              </td>
              <td className="px-6 py-4 text-center">
                <button className="text-[#3b5ccc] hover:opacity-70 transition-opacity cursor-pointer">
                  <Download size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}