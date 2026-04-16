import { useState } from "react";
import { Play, Pause } from "lucide-react";

import { TimerProvider, useTimer } from "@/app/context/TimerContext";

import { Card } from "@/app/components/Card/Card";
import { Button } from "@/app/components/ui/Button/Button";
import { TimerDisplay } from "@/app/components/ui/TimerDisplay";
import { TextArea } from "@/app/components/ui/TextArea/TextArea";
import { ConfirmationModal } from "@/app/components/ui/ConfirmationModal/ConfirmationModal";

const TimerCardContent = () => {
  const { isRunning, startTimer, stopTimer, resetTimer } = useTimer();
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    startTimer();
    setError(undefined);
  };

  const handleStopAttempt = () => {
    if (!description.trim()) {
      setError("A descrição é obrigatória para encerrar a atividade.");
      return;
    }
    setError(undefined);
    setIsModalOpen(true);
  };

  const handleConfirmFinish = () => {
    stopTimer();
    resetTimer();
    setDescription("");
    setIsModalOpen(false);
  };

  const timerChildClass = "w-full flex flex-col items-center p-6 gap-6 border-b border-slate-100 last:border-none";

  return (
    <>
      <Card
        title="Controle de Horas"
        icon="arrow"
        classContent="h-full flex flex-col items-center justify-center relative"
      >
        <div className={timerChildClass}>
          <TimerDisplay />
          
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white px-10 py-3 rounded-xl transition-all font-bold"
            >
              <Play size={18} fill="currentColor" />
              Iniciar
            </Button>
          ) : (
            <Button
              onClick={handleStopAttempt}
              className="flex items-center gap-2 !bg-[#f47b20] border border-orange-200 hover:bg-orange-100 text-white px-10 py-3 rounded-xl transition-all font-bold"
            >
              <Pause size={18} fill="currentColor" />
              Encerrar
            </Button>
          )}
        </div>

        <div className={timerChildClass}>
          <TextArea
            label="Descrição da atividade"
            placeholder="Descreva o que foi feito nesta atividade..."
            value={description}
            onChange={(val) => {
              setDescription(val);
              if (val.trim()) setError(undefined);
            }}
            disabled={!isRunning}
            error={error}
          />
        </div>
      </Card>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmFinish}
        title="Encerrar horas"
        description="Tem certeza de que deseja encerrar o relatório de horas atual?"
        warningMessage="Uma vez encerrado, os dados serão enviados para análise e não poderão ser alterados localmente."
        confirmText="Encerrar"
        cancelText="Cancelar"
      />
    </>
  );
};

export const TimerCard = () => (
  <TimerProvider>
    <TimerCardContent />
  </TimerProvider>
);