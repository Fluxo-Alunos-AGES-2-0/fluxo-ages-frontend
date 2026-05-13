import { useTimer } from "@/app/context/TimerContext";
import { useState } from "react";
import { ConfirmationModal } from "../ui/ConfirmationModal/ConfirmationModal";
import { useToast } from "@/app/context/ToastContext";

const MAX_CHARS = 1250;
const MIN_CHARS = 15;

export const HeaderTimerWidget = () => {
  const { isRunning, elapsedTime, stopTimer } = useTimer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const { showToast } = useToast();

  const handleConfirmStop = async (description?: string) => {
    if (!description) return;

    setIsStopping(true);
    try {
      await stopTimer(description);
      setIsModalOpen(false);
    } catch {
      showToast({
        variant: "error",
        title: "Erro",
        message: "Não foi possível encerrar.",
      });
    } finally {
      setIsStopping(false);
    }
  };

  if (!isRunning) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-3 bg-[#F47B2040] px-5 py-2 rounded-full transition-all cursor-pointer"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F47B20] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F47B20]" />
        </span>

        <span className="text-lg font-semibold text-[#F47B20]">
          {isStopping ? "Encerrando..." : formatMsToTime(elapsedTime)}
        </span>
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStop}
        isLoading={isStopping}
        withInput={true}
        title="Encerrar horas"
        description="Tem certeza de que deseja encerrar o relatório de horas atual?"
        warningMessage="Uma vez encerrado, o registro não poderá ser editado diretamente. Para realizar alterações, será necessário solicitar a edição."
        confirmText="Encerrar Ponto"
        cancelText="Voltar"
        inputMinLength={MIN_CHARS}
        inputMaxLength={MAX_CHARS}
      />
    </>
  );
};

function formatMsToTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}
