import React from "react";
import { useTimer } from "../../../context/TimerContext";

interface CronometroWidgetProps {
  color?: string;
}

export const CronometroWidget: React.FC<CronometroWidgetProps> = ({ color = "#f47b20" }) => {
  const { isRunning, elapsedTime } = useTimer();

  if (!isRunning) return null;

  const totalSeconds = Math.floor(elapsedTime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const fmt = (n: number) => n.toString().padStart(2, "0");

  const handleClick = () => {};

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer select-none"
      aria-label="Cronômetro em execução — clique para encerrar o ponto"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
      </span>

      <span 
        className="font-mono text-[15px] font-semibold tracking-widest"
        style={{ color: color }}
      >
        {fmt(hours)}:{fmt(minutes)}:{fmt(seconds)}
      </span>
    </button>
  );
};