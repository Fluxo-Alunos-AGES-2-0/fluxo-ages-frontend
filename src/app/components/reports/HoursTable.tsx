import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  Pencil,
  Timer,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Modal } from "@/app/components/ui/Modal/Modal";
import { RejectionJustificationModal } from "./RejectionJustificationModal";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const LONG_DESCRIPTION_THRESHOLD = 80;

function partsToDate(dateStr: string, timeStr: string): Date | null {
  const [day, month, year] = dateStr.split("/").map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = timeStr.split(":").map(Number);
  if ([day, month, year].some(Number.isNaN)) return null;
  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

type HourStatus = "APPROVED" | "REJECTED" | "PENDING";

interface HourEntry {
  id: number;
  startTime: string;
  sessionTimeSeconds: number;
  activities: string;
  status: HourStatus;
  rejectionJustification?: string | null;
}

interface HoursTableProps {
  data: HourEntry[];
  onChanged?: () => void;
}

export function HoursTable({ data, onChanged }: HoursTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [hours, setHours] = useState<HourEntry[]>(data);
  const [justificationModalText, setJustificationModalText] = useState<
    string | null
  >(null);

  const [editingItem, setEditingItem] = useState<HourEntry | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  const [deletingItem, setDeletingItem] = useState<HourEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setHours(data);
  }, [data]);

  function handleOpenEditModal(item: HourEntry) {
    const startDate = new Date(item.startTime);
    const endDate = new Date(
      startDate.getTime() + item.sessionTimeSeconds * 1000,
    );

    setEditingItem(item);
    setEditDescription(item.activities ?? "");
    setEditDate(startDate.toLocaleDateString("pt-BR"));
    setEditStartTime(startDate.toLocaleTimeString("pt-BR"));
    setEditEndTime(endDate.toLocaleTimeString("pt-BR"));
  }

  async function handleSaveEdit() {
    if (!editingItem) return;

    const description = editDescription.trim();
    const entry = partsToDate(editDate, editStartTime);
    const exit = partsToDate(editDate, editEndTime);

    if (!description || !entry || !exit) {
      showToast({
        variant: "error",
        title: "Campos obrigatórios",
        message: "Preencha descrição, data e horários corretamente.",
      });
      return;
    }

    // sessão que cruza a meia-noite: saída no dia seguinte
    if (exit <= entry) {
      exit.setDate(exit.getDate() + 1);
    }

    setIsSaving(true);
    try {
      await api.put(`/hours/report/${editingItem.id}`, {
        entryTime: entry.toISOString(),
        exitTime: exit.toISOString(),
        activities: description,
      });
      showToast({
        variant: "success",
        title: "Relatório atualizado",
        message: "Relatório de horas atualizado com sucesso.",
      });
      setEditingItem(null);
      setEditDescription("");
      setEditDate("");
      setEditStartTime("");
      setEditEndTime("");
      onChanged?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar relatório.";
      showToast({ variant: "error", title: "Erro ao atualizar", message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      await api.delete(`/report/${deletingItem.id}`);
      showToast({
        variant: "success",
        title: "Relatório deletado",
        message: "Relatório de horas deletado com sucesso.",
      });
      setDeletingItem(null);
      onChanged?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao deletar relatório.";
      showToast({ variant: "error", title: "Erro ao deletar", message });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleDateChange = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);

    let formatted = numbers;

    if (numbers.length > 2) {
      formatted = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    if (numbers.length > 4) {
      formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
    }

    setEditDate(formatted);
  };

  if (hours.length === 0) {
    return (
      <div className="text-center text-[#6b7280] dark:text-[#94A3B8] py-10">
        Nenhum registro de horas encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-[#eef0f4] dark:border-[#334155]">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="bg-[#f9fafb] dark:bg-[#0F172A] text-[#6b7280] dark:text-[#94A3B8] border-b border-[#eef0f4] dark:border-[#334155]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold w-32">Data</th>
              <th className="px-6 py-4 text-left font-semibold w-44">
                Duração
              </th>
              <th className="px-6 py-4 text-left font-semibold">Descrição</th>
              <th className="px-6 py-4 text-center font-semibold w-36">
                Status
              </th>
              <th className="px-6 py-4 text-right font-semibold w-28">Ações</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-[#1E293B]">
            {hours.map((item) => {
              const status: HourStatus = item.status ?? "APPROVED";
              const isExpanded = expandedId === item.id;
              const activities = item.activities ?? "";

              const isLongDescription =
                activities.length > LONG_DESCRIPTION_THRESHOLD;

              return (
                <tr
                  key={item.id}
                  className="
                  border-b border-[#eef0f4]
                dark:border-[#334155]
                odd:dark:bg-[#1E293B]
                even:dark:bg-[#182236]
                hover:bg-slate-50/30
                dark:hover:bg-[#334155]/50
                  transition-colors
                "
                >
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-[#94A3B8] align-top">
                    {new Date(item.startTime).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] dark:bg-[#334155] text-[#2563eb] dark:text-[#F4F6F7] px-3 py-1 rounded-full text-xs font-bold border border-[#dbeafe] dark:border-[#334155]">
                      <Clock size={14} />
                      {formatDuration(item.sessionTimeSeconds)}
                    </span>
                  </td>

                  <td className="px-6 py-4 align-top">
                    <div className="flex items-start gap-2 w-full">
                      <p
                        className={`text-slate-700 dark:text-[#F4F6F7] leading-relaxed break-all ${
                          isExpanded ? "whitespace-normal" : "line-clamp-1"
                        }`}
                      >
                        {activities}
                      </p>

                      {isLongDescription && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.id)
                          }
                          className="flex-shrink-0 mt-0.5 text-slate-400 dark:text-[#94A3B8] hover:text-blue-600 dark:hover:text-[#3B5CCC] cursor-pointer transition-colors p-1"
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
                    <div className="flex items-center justify-center gap-2">
                      <span className={getStatusClass(status)}>
                        {formatStatus(status)}
                      </span>
                      {status === "REJECTED" && item.rejectionJustification && (
                        <button
                          type="button"
                          onClick={() =>
                            setJustificationModalText(
                              item.rejectionJustification ?? null,
                            )
                          }
                          className="text-[#9ca3af] dark:text-[#94A3B8] hover:text-blue-600 dark:hover:text-[#3B5CCC] transition-colors"
                          title="Ver justificativa"
                        >
                          <MessageSquare size={18} />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right align-top">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        aria-label="Editar relatório"
                        title="Editar relatório"
                        onClick={() => handleOpenEditModal(item)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        aria-label="Excluir relatório"
                        title="Excluir relatório"
                        onClick={() => setDeletingItem(item)}
                        className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
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

      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Atualizar Relatório de Horas"
          className="max-w-xl"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] mb-2">
                Descrição<span className="text-[#F47B20]">*</span>
              </label>

              <textarea
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                className="w-full min-h-24 rounded-lg border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#334155] px-3 py-2 text-slate-700 dark:text-[#F4F6F7] outline-none resize-none focus:border-[#3B5CCC]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] mb-2">
                Data<span className="text-[#F47B20]">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={editDate}
                  onChange={(event) => handleDateChange(event.target.value)}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  className="w-full h-10 rounded-lg border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#334155] px-3 pr-10 text-slate-700 dark:text-[#F4F6F7] placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] outline-none focus:border-[#3B5CCC]"
                />
                <Calendar
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-[#94A3B8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2">
                Horário de Entrada<span className="text-[#F47B20]">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={editStartTime}
                  onChange={(event) => setEditStartTime(event.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 pr-10 text-slate-700 outline-none focus:border-[#3B5CCC]"
                />
                <Timer
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2">
                Horário de Saída<span className="text-[#F47B20]">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={editEndTime}
                  onChange={(event) => setEditEndTime(event.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 pr-10 text-slate-700 outline-none focus:border-[#3B5CCC]"
                />
                <Timer
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-5">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="h-14 rounded-xl bg-[#F47B20] text-white font-bold text-xl hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </button>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                disabled={isSaving}
                className="h-14 rounded-xl border border-slate-200 dark:border-[#334155] text-[#F47B20] font-bold text-xl hover:bg-slate-50 dark:hover:bg-[#334155] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deletingItem && (
        <Modal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          title="Deletar horas"
          className="max-w-xl"
        >
          <div className="space-y-4">
            <p className="text-[18px] font-medium text-slate-700 dark:text-[#F4F6F7]">
              Tem certeza de que deseja deletar o relatório de horas?
            </p>

            <div className="w-full bg-[#FBE4D3] dark:bg-[#334155] rounded-xl px-8 py-4 flex items-center gap-5">
              <TriangleAlert size={24} className="text-[#F47B20]" />

              <p className="text-[#F47B20] text-lg font-medium">
                Uma vez deletado, você não pode restaurar o relatório.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="h-14 rounded-xl border border-slate-200 dark:border-[#334155] text-[#F47B20] font-bold text-xl hover:bg-slate-50 dark:hover:bg-[#334155] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-14 rounded-xl bg-[#F2994A] text-white font-bold text-xl hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <RejectionJustificationModal
        isOpen={!!justificationModalText}
        onClose={() => setJustificationModalText(null)}
        justification={justificationModalText}
      />
    </>
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
