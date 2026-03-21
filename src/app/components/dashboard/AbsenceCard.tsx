import { UserCheck } from "lucide-react";

const FALTAS = 2;
const MAX_FALTAS = 4;

function getStatus(faltas: number, max: number) {
  const ratio = faltas / max;
  if (ratio >= 1) return "critical";
  if (ratio >= 0.75) return "warning";
  return "ok";
}

const STATUS_CONFIG = {
  ok:       { label: "Situação OK",  textCls: "text-green-600 dark:text-green-400",  bgCls: "bg-green-50 dark:bg-green-900/20",    borderCls: "border-green-200 dark:border-green-800/40", dotCls: "bg-green-400",  valueCls: "text-[#1F2937] dark:text-[#F9FAFB]" },
  warning:  { label: "Atenção",      textCls: "text-yellow-600 dark:text-yellow-400", bgCls: "bg-yellow-50 dark:bg-yellow-900/20",  borderCls: "border-yellow-200 dark:border-yellow-800/40", dotCls: "bg-yellow-400", valueCls: "text-yellow-500" },
  critical: { label: "Crítico",      textCls: "text-red-600 dark:text-red-400",       bgCls: "bg-red-50 dark:bg-red-900/20",        borderCls: "border-red-200 dark:border-red-800/40",     dotCls: "bg-red-400",    valueCls: "text-red-500" },
};

export function AbsenceCard() {
  const status = getStatus(FALTAS, MAX_FALTAS);
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className="h-full bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] flex flex-col overflow-hidden transition-colors duration-300"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#E5E7EB] dark:border-[#334155]">
        <UserCheck className="w-4 h-4 text-[#3B5CCC] dark:text-[#4F6EF7]" />
        <span className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 600 }}>
          Faltas
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-between px-5 py-4 gap-4">
        {/* Big number */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <span
            className={`text-[52px] leading-none tabular-nums ${cfg.valueCls}`}
            style={{ fontWeight: 700 }}
          >
            {FALTAS}
          </span>
          <span className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
            {FALTAS === 1 ? "falta registrada" : "faltas registradas"}
          </span>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: MAX_FALTAS }).map((_, i) => (
            <div
              key={i}
              className={[
                "w-3.5 h-3.5 rounded-full transition-colors duration-300",
                i < FALTAS
                  ? status === "ok"
                    ? "bg-[#3B5CCC] dark:bg-[#4F6EF7]"
                    : status === "warning"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                  : "bg-[#E5E7EB] dark:bg-[#334155]",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Status badge */}
        <div
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-[8px] border ${cfg.bgCls} ${cfg.borderCls}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dotCls}`} />
          <p className={`text-xs ${cfg.textCls}`}>
            <span style={{ fontWeight: 600 }}>{cfg.label}</span> · Máx: {MAX_FALTAS}
          </p>
        </div>
      </div>
    </div>
  );
}
