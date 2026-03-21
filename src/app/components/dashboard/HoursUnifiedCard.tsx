import { TrendingUp } from "lucide-react";

const HOURS = {
  completed: 42,
  remaining: 18,
  total: 60,
};

const pct = Math.round((HOURS.completed / HOURS.total) * 100);

// SVG donut params
const SIZE = 96;
const STROKE = 9;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const DASH = (pct / 100) * CIRC;

interface StatProps {
  value: string;
  label: string;
  color: string;
}

function Stat({ value, label, color }: StatProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-2xl tabular-nums ${color}`} style={{ fontWeight: 700 }}>
        {value}
      </span>
      <span className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] text-center">
        {label}
      </span>
    </div>
  );
}

export function HoursUnifiedCard() {
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
          Controle de Horas
        </span>
      </div>

      {/* Body: left stats | divider | right chart */}
      <div className="flex-1 flex items-center px-5 py-3 gap-0">

        {/* Left — stats */}
        <div className="flex-1 flex items-center justify-around">
          <Stat
            value={`${HOURS.completed}h`}
            label="Concluídas"
            color="text-[#3B5CCC] dark:text-[#4F6EF7]"
          />
          <div className="w-px h-8 bg-[#E5E7EB] dark:bg-[#334155]" />
          <Stat
            value={`${HOURS.remaining}h`}
            label="A cumprir"
            color="text-[#F47B20]"
          />
          <div className="w-px h-8 bg-[#E5E7EB] dark:bg-[#334155]" />
          <Stat
            value={`${HOURS.total}h`}
            label="Total"
            color="text-[#1F2937] dark:text-[#F9FAFB]"
          />
        </div>

        {/* Vertical divider */}
        <div className="w-px self-stretch mx-5 bg-[#E5E7EB] dark:bg-[#334155]" />

        {/* Right — donut chart */}
        <div className="flex items-center justify-center">
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
                className="text-lg tabular-nums text-[#1F2937] dark:text-[#F9FAFB]"
                style={{ fontWeight: 700, lineHeight: 1 }}
              >
                {pct}%
              </span>
              <span className="text-[8px] text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wide mt-0.5">
                concluído
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
