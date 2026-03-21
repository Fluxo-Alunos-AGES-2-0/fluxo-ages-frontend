import { TrendingUp } from "lucide-react";

const HOURS = {
  completed: 42,
  remaining: 18,
  total: 60,
};

const pct = Math.round((HOURS.completed / HOURS.total) * 100);

// SVG donut params
const SIZE = 120;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const DASH = (pct / 100) * CIRC;

export function HoursChartCard() {
  return (
    <div
      className="h-full bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] flex flex-col overflow-hidden transition-colors duration-300"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      {/* Accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]" />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#E5E7EB] dark:border-[#334155]">
        <TrendingUp className="w-4 h-4 text-[#3B5CCC] dark:text-[#4F6EF7]" />
        <span className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 600 }}>
          Horas
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-between px-4 py-4 gap-3">
        {/* Donut chart */}
        <div className="relative flex items-center justify-center">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="-rotate-90"
          >
            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              strokeWidth={STROKE}
              className="stroke-[#E5E7EB] dark:stroke-[#334155]"
            />
            {/* Progress */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${DASH} ${CIRC}`}
              className="stroke-[#3B5CCC] dark:stroke-[#4F6EF7] transition-all duration-700"
            />
          </svg>

          {/* Center label */}
          <div className="absolute flex flex-col items-center">
            <span
              className="text-xl tabular-nums text-[#1F2937] dark:text-[#F9FAFB]"
              style={{ fontWeight: 700, lineHeight: 1 }}
            >
              {pct}%
            </span>
            <span className="text-[9px] text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wide mt-0.5">
              concluído
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="w-full flex items-center justify-around">
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="text-base tabular-nums text-[#3B5CCC] dark:text-[#4F6EF7]"
              style={{ fontWeight: 700 }}
            >
              {HOURS.completed}h
            </span>
            <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">Concluídas</span>
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] dark:bg-[#334155]" />
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="text-base tabular-nums text-[#F47B20]"
              style={{ fontWeight: 700 }}
            >
              {HOURS.remaining}h
            </span>
            <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">A cumprir</span>
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] dark:bg-[#334155]" />
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="text-base tabular-nums text-[#1F2937] dark:text-[#F9FAFB]"
              style={{ fontWeight: 700 }}
            >
              {HOURS.total}h
            </span>
            <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">Total</span>
          </div>
        </div>

        {/* Note */}
        <div className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#EEF2FF] dark:bg-[#3B5CCC]/10">
          <TrendingUp className="w-3 h-3 text-[#3B5CCC] dark:text-[#4F6EF7] flex-shrink-0" />
          <p className="text-xs text-[#3B5CCC] dark:text-[#4F6EF7]">
            <span style={{ fontWeight: 600 }}>{HOURS.remaining}h restantes</span> para concluir.
          </p>
        </div>
      </div>
    </div>
  );
}
