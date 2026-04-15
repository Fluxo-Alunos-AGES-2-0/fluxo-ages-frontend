import React from 'react';
import { useTimer } from '../../context/TimerContext';

interface TimerDisplayProps {
  color?: string; 
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ color = 'text-slate-800' }) => {
  const { elapsedTime } = useTimer();

  const totalSeconds = Math.floor(elapsedTime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const isTailwindClass = color.startsWith('text-');
  const textColorClass = isTailwindClass ? color : '';
  const inlineStyle = !isTailwindClass ? { color } : undefined;

  const TimeBlock = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-slate-100 rounded-2xl w-24 h-24 flex items-center justify-center shadow-sm">
        <span
          className={`text-5xl font-bold tracking-widest ${textColorClass}`}
          style={inlineStyle}
        >
          {value}
        </span>
      </div>
      <span className="text-[10px] text-slate-400 font-semibold mt-3 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <div className="h-24 flex items-center px-3">
      <span className="text-3xl font-bold text-slate-300 pb-2">:</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center font-sans">
      <TimeBlock value={formatTime(hours)} label="Horas" />
      <Separator />
      <TimeBlock value={formatTime(minutes)} label="Min" />
      <Separator />
      <TimeBlock value={formatTime(seconds)} label="Seg" />
    </div>
  );
};