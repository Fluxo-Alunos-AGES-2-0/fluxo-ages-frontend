import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Modal } from "../ui/Modal/Modal";
import { Button } from "../ui/Button/Button";
import { Loader } from "../Loader/Loader";
import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import {
  AttendanceHistoryDay,
  AttendanceHistoryResponse,
  AttendanceStatus,
} from "../../types/dashboard";

interface FrequenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENTE: "Presente",
  AUSENTE: "Ausente",
  ABONADO: "Abonado",
};

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  PRESENTE: "text-green-600 dark:text-green-400",
  AUSENTE: "text-red-500 dark:text-red-400",
  ABONADO: "text-sky-600 dark:text-sky-400",
};

function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(year, month - 1, day, 12, 0, 0);
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
  }).format(value);

  return formatted.replace(/(^\d+\s+de\s+)(.)/, (_, prefix: string, char: string) => {
    return `${prefix}${char.toUpperCase()}`;
  });
}

export function FrequenciaModal({ isOpen, onClose }: FrequenciaModalProps) {
  const [attendanceDays, setAttendanceDays] = useState<AttendanceHistoryDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    setIsLoading(true);

    api
      .get<AttendanceHistoryResponse>("/students/me/attendance")
      .then((response) => {
        if (!isMounted) return;
        setAttendanceDays(response.days);
      })
      .catch(() => {
        if (!isMounted) return;

        setAttendanceDays([]);
        showToast({
          variant: "error",
          title: "Erro ao carregar",
          message: "Não foi possível carregar o detalhamento da frequência.",
        });
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, showToast]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Frequência"
      className="!max-w-2xl !h-[85vh]"
      footer={
        <Button
          variant="primary"
          fullWidth
          onClick={onClose}
          className="!bg-[#f47b20] hover:!bg-[#d96a18]"
        >
          Fechar
        </Button>
      }
    >
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <hr className="mb-4 shrink-0 border-t border-gray-200 dark:border-[#334155]" />

        {isLoading ? (
          <div className="flex min-h-40 flex-1 items-center justify-center">
            <Loader />
          </div>
        ) : attendanceDays.length === 0 ? (
          <div className="flex min-h-40 flex-1 items-center justify-center rounded-lg bg-gray-50 px-6 py-8 text-center text-sm text-slate-500 dark:bg-[#0F172A] dark:text-[#94A3B8]">
            Nenhum registro de frequência disponível.
          </div>
        ) : (
          <div
            className="min-h-0 flex-1 overflow-y-scroll pr-2
            [scrollbar-gutter:stable]
            [scrollbar-width:thin]
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-slate-200
            dark:[&::-webkit-scrollbar-thumb]:bg-[#334155]"
          >
            <div className="flex flex-col gap-5 pb-1">
              {attendanceDays.map((day) => (
                <div key={day.date} className="flex flex-col gap-2">
                  <p className="text-base font-semibold text-[#1f2937] dark:text-[#F4F6F7]">
                    {formatDateLabel(day.date)}
                  </p>

                  {day.slots.map((slot, index) => (
                    <div
                      key={`${day.date}-${slot.time}-${index}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-[#0F172A]"
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-[#f47b20]" />
                        <span className="text-sm text-[#374151] dark:text-[#F4F6F7]">{slot.time}</span>
                      </div>
                      <span className={`text-sm font-bold ${STATUS_COLORS[slot.status]}`}>
                        {STATUS_LABELS[slot.status]}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
