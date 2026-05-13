import { useState } from "react";
import { Play, Pause } from "lucide-react";

import { useTimer } from "@/app/context/TimerContext";
import { useToast } from "@/app/context/ToastContext";

import { Card } from "@/app/components/Card/Card";
import { Button } from "@/app/components/ui/Button/Button";
import { TimerDisplay } from "@/app/components/ui/TimerDisplay";
import { TextArea } from "@/app/components/ui/TextArea/TextArea";
import { ConfirmationModal } from "@/app/components/ui/ConfirmationModal/ConfirmationModal";

const MAX_CHARS = 1250;
const MIN_CHARS = 15;

interface TimerCardContentProps {
  onConfirmFinish: () => Promise<void>;
}

const TimerCardContent = ({ onConfirmFinish }: TimerCardContentProps) => {
  const { isRunning, startTimer, stopTimer, resetTimer } = useTimer();
  const { showToast } = useToast();

  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startTimer();
      setError(undefined);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao iniciar registro de horas.";
      setError(msg);
      showToast({ variant: "error", title: "Erro ao iniciar", message: msg });
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopAttempt = () => {
    const trimmedDescription = description.trim();
    const currentLength = trimmedDescription.length;

    if (currentLength < MIN_CHARS) {
      setError(
        `A descrição deve ter no mínimo ${MIN_CHARS} caracteres para encerrar.`,
      );
      return;
    }

    if (currentLength > MAX_CHARS) {
      setError(`A descrição excedeu o limite de ${MAX_CHARS} caracteres.`);
      return;
    }

    setError(undefined);
    setIsModalOpen(true);
  };

  const handleConfirmFinish = async () => {
    setIsStopping(true);
    try {
      await stopTimer(description);
      await onConfirmFinish();

      resetTimer();
      setDescription("");
      setError(undefined);
      setIsModalOpen(false);

      showToast({
        variant: "success",
        title: "Horas registradas",
        message: "Suas horas foram salvas com sucesso.",
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao encerrar registro de horas.";
      setError(msg);
      setIsModalOpen(false);
      showToast({ variant: "error", title: "Erro ao encerrar", message: msg });
    } finally {
      setIsStopping(false);
    }
  };

  const timerChildClass =
    "w-full flex flex-col items-center p-6 gap-6 border-b border-slate-100 last:border-none";

  return (
    <>
      <Card
        title="Controle de Horas"
        icon="arrow"
        classContent="flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Seção do Cronômetro e Botões de Ação */}
        <div className={timerChildClass}>
          <TimerDisplay />

          {!isRunning ? (
            <Button
              onClick={handleStart}
              disabled={isStarting}
              className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white px-10 py-3 rounded-xl transition-all font-bold"
            >
              <Play size={18} fill="currentColor" />
              {isStarting ? "Iniciando..." : "Iniciar"}
            </Button>
          ) : (
            <Button
              onClick={handleStopAttempt}
              disabled={isStopping}
              className="flex items-center gap-2 !bg-[#f47b20] border border-orange-200 hover:bg-orange-100 text-white px-10 py-3 rounded-xl transition-all font-bold"
            >
              <Pause size={18} fill="currentColor" />
              Encerrar
            </Button>
          )}
        </div>

        {/* Seção da TextArea com Contador e Erro Inline */}
        <div className={timerChildClass}>
          <TextArea
            label="Descrição da atividade"
            placeholder="Descreva o que foi feito nesta atividade..."
            value={description}
            onChange={(val) => {
              setDescription(val);
              if (
                val.trim().length >= MIN_CHARS &&
                val.trim().length <= MAX_CHARS
              ) {
                setError(undefined);
              }
            }}
            disabled={!isRunning}
            error={error}
            maxLength={MAX_CHARS}
          />
        </div>
      </Card>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmFinish}
        title="Encerrar horas"
        description="Tem certeza de que deseja encerrar o relatório de horas atual?"
        warningMessage="Uma vez encerrado, o registro não poderá ser editado diretamente. Para realizar alterações, será necessário solicitar a edição."
        confirmText={isStopping ? "Encerrando..." : "Encerrar"}
        cancelText="Cancelar"
      />
    </>
  );
};

export const TimerCard = ({ onConfirmFinish }: TimerCardContentProps) => (
  <TimerCardContent onConfirmFinish={onConfirmFinish} />
);
