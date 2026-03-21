import { useState, useEffect, useRef } from "react";
import { Clock, Pause, Play, Square, X, GripHorizontal } from "lucide-react";
import { useTimer } from "../../context/TimerContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(total: number) {
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FloatingTimerWidget() {
  const {
    seconds, running, saved,
    timerCardVisible,
    handleStart, handlePause, handleSave,
  } = useTimer();

  // Collapsed state — user can minimise to a pill
  const [collapsed, setCollapsed] = useState(false);
  // Dismissed for this "pop-up" — resets when session ends
  const [dismissed, setDismissed] = useState(false);

  // Reset dismiss whenever a new session starts
  useEffect(() => {
    if (running) setDismissed(false);
  }, [running]);

  // Auto-hide when saved
  useEffect(() => {
    if (saved) setDismissed(false);
  }, [saved]);

  // ── Visibility logic ──────────────────────────────────────────────────────
  // Show when: session is active AND main card is NOT visible AND not dismissed
  const shouldShow = running && !timerCardVisible && !dismissed;

  // ── Drag-to-reposition ────────────────────────────────────────────────────
  const widgetRef = useRef<HTMLDivElement>(null);
  // Position stored as offset from bottom-right
  const [pos, setPos] = useState({ right: 24, bottom: 24 });
  const dragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, right: 24, bottom: 24 });

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      right: pos.right,
      bottom: pos.bottom,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      setPos({
        right:  Math.max(8, dragStart.current.right  - dx),
        bottom: Math.max(8, dragStart.current.bottom - dy),
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  // ── Animation classes ─────────────────────────────────────────────────────
  // We mount/unmount with a small CSS transition via opacity + translate
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // slight delay so the transition fires after mount
    if (shouldShow) {
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [shouldShow]);

  if (!shouldShow && !visible) return null;

  return (
    <div
      ref={widgetRef}
      role="status"
      aria-label="Sessão em andamento"
      style={{
        position: "fixed",
        right:    pos.right,
        bottom:   pos.bottom,
        zIndex:   9999,
        transition: "opacity 280ms ease, transform 280ms ease",
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
        // pointer-events off while invisible so clicks fall through
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {collapsed ? (
        /* ── Pill mode ──────────────────────────────────────────────────── */
        <button
          onClick={() => setCollapsed(false)}
          className={[
            "flex items-center gap-2 px-4 py-2.5 rounded-full",
            "bg-[#3B5CCC] dark:bg-[#4F6EF7] text-white",
            "shadow-[0_8px_24px_rgba(59,92,204,0.35)]",
            "hover:brightness-110 transition-all duration-200 cursor-pointer",
          ].join(" ")}
          title="Expandir widget de sessão"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F47B20] animate-pulse" />
          <Clock className="w-3.5 h-3.5 opacity-80" />
          <span
            className="font-mono text-sm tabular-nums"
            style={{ fontWeight: 700, letterSpacing: "0.04em" }}
          >
            {formatTime(seconds)}
          </span>
        </button>
      ) : (
        /* ── Full card mode ─────────────────────────────────────────────── */
        <div
          className={[
            "w-[220px] md:w-[240px] rounded-[12px]",
            "bg-white dark:bg-[#1E293B]",
            "border border-[#E5E7EB] dark:border-[#334155]",
            "overflow-hidden select-none",
          ].join(" ")}
          style={{
            boxShadow: "0 12px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]" />

          {/* Drag handle + header row */}
          <div
            className="flex items-center justify-between px-3.5 pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onMouseDown={onMouseDown}
          >
            <div className="flex items-center gap-2">
              {/* Pulsing dot */}
              <span className="w-2 h-2 rounded-full bg-[#F47B20] animate-pulse flex-shrink-0" />
              <span
                className="text-xs text-[#1F2937] dark:text-[#F9FAFB]"
                style={{ fontWeight: 600 }}
              >
                Sessão ativa
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {/* Grip icon (drag affordance) */}
              <GripHorizontal className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#64748B] mr-1" />
              {/* Collapse */}
              <button
                onClick={() => setCollapsed(true)}
                className="p-1 rounded-[6px] text-[#9CA3AF] dark:text-[#64748B] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/60 transition-colors cursor-pointer"
                title="Minimizar"
              >
                <span className="block w-3 h-px bg-current mt-[7px]" />
              </button>
              {/* Dismiss (hides widget until next session) */}
              <button
                onClick={() => setDismissed(true)}
                className="p-1 rounded-[6px] text-[#9CA3AF] dark:text-[#64748B] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/60 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center gap-3 px-4 py-3">
            {/* Clock + time */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-[#EEF2FF] dark:bg-[#3B5CCC]/20">
                <Clock className="w-4 h-4 text-[#3B5CCC] dark:text-[#4F6EF7]" />
              </div>
              <span
                className="font-mono text-[26px] leading-none tabular-nums text-[#3B5CCC] dark:text-[#4F6EF7]"
                style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {formatTime(seconds)}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[#E5E7EB] dark:border-[#334155]" />

            {/* Controls */}
            <div className="flex items-center gap-2 w-full">
              {/* Pause / Resume */}
              {running ? (
                <button
                  onClick={handlePause}
                  className={[
                    "flex items-center justify-center gap-1.5 flex-1 py-2 rounded-[8px] text-xs transition-all duration-200 cursor-pointer",
                    "bg-[#F5F6FA] dark:bg-[#0F172A]/60 border border-[#E5E7EB] dark:border-[#334155]",
                    "text-[#6B7280] dark:text-[#94A3B8] hover:border-[#3B5CCC]/40 dark:hover:border-[#4F6EF7]/40",
                    "hover:text-[#3B5CCC] dark:hover:text-[#4F6EF7]",
                  ].join(" ")}
                >
                  <Pause className="w-3 h-3" />
                  <span style={{ fontWeight: 600 }}>Pausar</span>
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className={[
                    "flex items-center justify-center gap-1.5 flex-1 py-2 rounded-[8px] text-xs transition-all duration-200 cursor-pointer",
                    "bg-[#EEF2FF] dark:bg-[#3B5CCC]/20 border border-[#3B5CCC]/20 dark:border-[#4F6EF7]/30",
                    "text-[#3B5CCC] dark:text-[#4F6EF7]",
                    "hover:bg-[#3B5CCC] hover:dark:bg-[#4F6EF7] hover:text-white hover:dark:text-white",
                  ].join(" ")}
                >
                  <Play className="w-3 h-3" />
                  <span style={{ fontWeight: 600 }}>Retomar</span>
                </button>
              )}

              {/* Save / finish */}
              <button
                onClick={handleSave}
                className={[
                  "flex items-center justify-center gap-1.5 flex-1 py-2 rounded-[8px] text-xs transition-all duration-200 cursor-pointer",
                  "bg-[#FFF5EC] dark:bg-[#F47B20]/10 border border-[#F47B20]/30",
                  "text-[#F47B20] hover:bg-[#F47B20] hover:text-white",
                ].join(" ")}
              >
                <Square className="w-3 h-3" />
                <span style={{ fontWeight: 600 }}>Salvar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
