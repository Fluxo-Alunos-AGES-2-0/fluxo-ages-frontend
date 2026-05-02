import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Pencil, Trash2 } from "lucide-react";

type HourStatus = "VALIDO" | "INVALIDO" | "REQUISITADO";

interface HourEntry {
  id: number;
  startTime: string;
  totalTimeSeconds: number;
  description: string;
  status?: HourStatus;
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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#f9fafb] text-[#6b7280] border-b border-[#eef0f4]">
          <tr>
            <th className="px-4 py-3 text-left">Data</th>
            <th className="px-4 py-3 text-left">Duração</th>
            <th className="px-4 py-3 text-left">Descrição</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const status: HourStatus = item.status ?? "VALIDO";
            const isExpanded = expandedId === item.id;

            return (
              <tr key={item.id} className="border-t border-[#eef0f4]">
                <td className="px-4 py-3">
                  {new Date(item.startTime).toLocaleDateString("pt-BR")}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex min-w-[120px] items-center justify-center gap-1.5 bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium">
                    <Clock size={13} strokeWidth={2} />
                    {formatDuration(item.totalTimeSeconds)}
                  </span>
                </td>

                <td className="px-4 py-3 max-w-[430px]">
                  <div className="flex items-start gap-2">
                    <span
                      className={[
                        "block text-[#111827]",
                        isExpanded
                          ? "whitespace-normal leading-relaxed"
                          : "truncate max-w-[360px]",
                      ].join(" ")}
                    >
                      {item.description}
                    </span>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="mt-[2px] text-[#6b7280] hover:text-[#3b5ccc] cursor-pointer"
                      aria-label="Expandir descrição"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className={getStatusClass(status)}>
                    {formatStatus(status)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled
                      aria-label="Editar relatório"
                      title="Em breve"
                      className="text-[#3b5ccc] opacity-50 cursor-not-allowed"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      disabled
                      aria-label="Excluir relatório"
                      title="Em breve"
                      className="text-red-500 opacity-50 cursor-not-allowed"
                    >
                      <Trash2 size={16} />
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

  return `${h}h ${m}min ${s}seg`;
}

function formatStatus(status: HourStatus) {
  switch (status) {
    case "VALIDO":
      return "Válido";
    case "INVALIDO":
      return "Inválido";
    case "REQUISITADO":
      return "Requisitado";
    default:
      return "Válido";
  }
}

function getStatusClass(status: HourStatus) {
  const base = "px-2 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case "VALIDO":
      return `${base} bg-green-100 text-green-600`;
    case "INVALIDO":
      return `${base} bg-red-100 text-red-600`;
    case "REQUISITADO":
      return `${base} bg-orange-100 text-orange-600`;
    default:
      return `${base} bg-green-100 text-green-600`;
  }
}
