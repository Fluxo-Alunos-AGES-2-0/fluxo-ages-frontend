import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Pencil, Trash2 } from "lucide-react";

const LONG_DESCRIPTION_THRESHOLD = 80;

type HourStatus = "APPROVED" | "REJECTED" | "PENDING";

interface HourEntry {
  id: number;
  startTime: string;
  sessionTimeSeconds: number;
  activities: string;
  status: HourStatus;
}

interface HoursTableProps {
  data: HourEntry[];
}

export function HoursTable({ data }: HoursTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="text-center text-[#6b7280] py-10">
        Nenhum registro de horas encontrado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#eef0f4]">
      <table className="w-full text-sm border-collapse table-fixed">
        <thead className="bg-[#f9fafb] text-[#6b7280] border-b border-[#eef0f4]">
          <tr>
            <th className="px-6 py-4 text-left font-semibold w-32">Data</th>
            <th className="px-6 py-4 text-left font-semibold w-44">Duração</th>
            <th className="px-6 py-4 text-left font-semibold">Descrição</th>
            <th className="px-6 py-4 text-center font-semibold w-36">Status</th>
            <th className="px-6 py-4 text-right font-semibold w-28">Ações</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {data.map((item) => {
            const status: HourStatus = item.status ?? "VALIDO";
            const isExpanded = expandedId === item.id;
            const isLongDescription =
              item.activities.length > LONG_DESCRIPTION_THRESHOLD;

            return (
              <tr
                key={item.id}
                className="border-b border-[#eef0f4] hover:bg-slate-50/30 transition-colors"
              >
                {/* Adicionado align-top em todas as células para manter o alinhamento no topo */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 align-top">
                  {new Date(item.startTime).toLocaleDateString("pt-BR")}
                </td>

                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#2563eb] px-3 py-1 rounded-full text-xs font-bold border border-[#dbeafe]">
                    <Clock size={14} />
                    {formatDuration(item.sessionTimeSeconds)}
                  </span>
                </td>

                <td className="px-6 py-4 align-top">
                  <div className="flex items-start gap-2 w-full">
                    <p
                      className={`text-slate-700 leading-relaxed break-all ${isExpanded ? "whitespace-normal" : "line-clamp-1"
                        }`}
                    >
                      {item.activities}
                    </p>

                    {isLongDescription && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.id)
                        }
                        className="flex-shrink-0 mt-0.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors p-1"
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-center align-top">
                  <span className={getStatusClass(status)}>
                    {formatStatus(status)}
                  </span>
                </td>

                <td className="px-6 py-4 text-right align-top">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled
                      aria-label="Editar relatório"
                      title="Em breve"
                      className="text-blue-500/40 cursor-not-allowed"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      disabled
                      aria-label="Excluir relatório"
                      title="Em breve"
                      className="text-red-500/40 cursor-not-allowed"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function formatStatus(status: HourStatus) {
  const labels: Record<HourStatus, string> = {
    APPROVED: "Válido",
    REJECTED: "Inválido",
    PENDING: "Requisitado",
  };
  return labels[status] ?? "Válido";
}

function getStatusClass(status: HourStatus) {
  const base =
    "inline-block w-24 px-2 py-1 rounded-full text-[11px] font-bold border";
  switch (status) {
    case "APPROVED":
      return `${base} bg-[#f0fdf4] text-[#22c55e] border-[#bbf7d0]`;
    case "REJECTED":
      return `${base} bg-[#fef2f2] text-[#ef4444] border-[#fecaca]`;
    case "PENDING":
      return `${base} bg-[#fff7ed] text-[#f97316] border-[#fed7aa]`;
    default:
      return `${base} bg-[#f0fdf4] text-[#22c55e] border-[#bbf7d0]`;
  }
}
