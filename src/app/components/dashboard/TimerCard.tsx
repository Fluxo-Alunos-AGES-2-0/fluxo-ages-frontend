import { useEffect, useRef } from "react";
import { Clock, Square, Play, CheckCircle } from "lucide-react";
import { useTimer } from "../../context/TimerContext";

function formatTime(total: number) {
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return { h, m, s };
}

export function TimerCard() {
  const {
    seconds, running, activity, saved,
    setActivity, handleStart, handleSave,
    setTimerCardVisible,
  } = useTimer();

  const cardRef = useRef<HTMLDivElement>(null);

  // ── Report visibility to context so the floating widget knows when to hide ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setTimerCardVisible(entry.isIntersecting),
      { threshold: 0.3 }, // visible when ≥ 30 % of the card is in view
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setTimerCardVisible]);

  const { h, m, s } = formatTime(seconds);

  return (
    <div
      ref={cardRef}
      className="h-full bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden flex flex-col transition-colors duration-300"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      {/* Accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
        <div className="flex items-center gap-2.5">
          <span className="text-[#3B5CCC] dark:text-[#4F6EF7]">
            <Clock className="w-4 h-4" />
          </span>
          <h3
            className="text-sm text-[#1F2937] dark:text-[#F9FAFB]"
            style={{ fontWeight: 600 }}
          >
            Registro de Horas
          </h3>
        </div>

        {running && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5EC] border border-[#F47B20]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F47B20] animate-pulse" />
            <span className="text-[#F47B20] text-xs" style={{ fontWeight: 600 }}>
              Gravando
            </span>
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-green-600 text-xs" style={{ fontWeight: 600 }}>
              Salvo!
            </span>
          </div>
        )}
      </div>

      {/* Timer display */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-5 gap-5">
        <div className="relative flex items-center justify-center gap-1">
          {running && (
            <div className="absolute inset-0 rounded-2xl bg-[#3B5CCC]/4 dark:bg-[#4F6EF7]/8 blur-2xl scale-150 pointer-events-none" />
          )}

          {[h, m, s].map((unit, idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center px-0.5">
                <div
                  className={[
                    "flex items-center justify-center rounded-[8px] min-w-[60px] px-2.5 py-2.5 transition-all duration-300",
                    running
                      ? "bg-[#EEF2FF] dark:bg-[#3B5CCC]/20 border border-[#3B5CCC]/20 dark:border-[#4F6EF7]/30"
                      : "bg-[#F5F6FA] dark:bg-[#0F172A]/60 border border-[#E5E7EB] dark:border-[#334155]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-mono text-[34px] leading-none tabular-nums transition-colors duration-300",
                      running
                        ? "text-[#3B5CCC] dark:text-[#4F6EF7]"
                        : "text-[#1F2937] dark:text-[#F9FAFB]",
                    ].join(" ")}
                    style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    {unit}
                  </span>
                </div>
                <span
                  className="text-[9px] text-[#9CA3AF] dark:text-[#64748B] mt-1 uppercase tracking-widest"
                  style={{ fontWeight: 500 }}
                >
                  {["Horas", "Min", "Seg"][idx]}
                </span>
              </div>

              {idx < 2 && (
                <span
                  className={[
                    "text-[28px] font-mono mb-4 px-0.5 transition-colors duration-300",
                    running
                      ? "text-[#3B5CCC] dark:text-[#4F6EF7] animate-pulse"
                      : "text-[#D1D5DB] dark:text-[#334155]",
                  ].join(" ")}
                  style={{ fontWeight: 700 }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {!running ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 rounded-[8px] bg-[#3B5CCC] hover:bg-[#2d4db3] active:bg-[#2640a0] text-white transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer px-[40px] py-[12px]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span className="text-sm" style={{ fontWeight: 600 }}>
              {seconds > 0 ? "Retomar" : "Iniciar"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-7 py-3 rounded-[8px] bg-[#F47B20] hover:bg-[#d96a15] active:bg-[#c25f12] text-white transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            <span className="text-sm" style={{ fontWeight: 600 }}>
              Salvar horas
            </span>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-[#E5E7EB] dark:border-[#334155]" />

      {/* Activity description */}
      <div className="px-5 py-4">
        <label
          className="block text-xs text-[#6B7280] dark:text-[#94A3B8] mb-2"
          style={{ fontWeight: 500 }}
        >
          Descrição da atividade
        </label>
        <textarea
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Descreva o que foi feito nesta atividade..."
          rows={3}
          className={[
            "w-full resize-none px-3 py-2.5 text-sm rounded-[8px] border",
            "bg-white dark:bg-[#0F172A]/50 text-[#1F2937] dark:text-[#F9FAFB]",
            "placeholder:text-[#C4C9D4] dark:placeholder:text-[#475569]",
            "border-[#E5E7EB] dark:border-[#334155]",
            "focus:outline-none focus:border-[#3B5CCC] dark:focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#3B5CCC]/20 dark:focus:ring-[#4F6EF7]/20",
            "transition-all duration-200",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
