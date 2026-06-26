import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import { Clock, Minus } from "lucide-react";
import { useTimer } from "@/app/context/TimerContext";
import { useToast } from "@/app/context/ToastContext";
import { ConfirmationModal } from "../ui/ConfirmationModal/ConfirmationModal";

const MAX_CHARS = 1250;
const MIN_CHARS = 15;

// Tela principal de registro; nela o widget flutuante não aparece.
const MAIN_ROUTE = "/dashboard";

// Movimento (px) acima do qual o gesto é arraste, não clique.
const DRAG_THRESHOLD = 4;

function formatHMS(ms: number): string {
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function FloatingTimerWidget() {
  const { isRunning, elapsedTime, stopTimer } = useTimer();
  const { pathname } = useLocation();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Posição arrastada (null = canto inferior direito padrão).
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const moved = useRef(false);
  const origin = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

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

  const handlePointerDown = (event: React.PointerEvent) => {
    const node = widgetRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    offset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    origin.current = { x: event.clientX, y: event.clientY };
    setPos({ x: rect.left, y: rect.top });
    dragging.current = true;
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = Math.abs(event.clientX - origin.current.x);
    const dy = Math.abs(event.clientY - origin.current.y);
    if (dx + dy > DRAG_THRESHOLD) moved.current = true;

    const node = widgetRef.current;
    const width = node?.offsetWidth ?? 0;
    const height = node?.offsetHeight ?? 0;
    const x = Math.max(8, Math.min(event.clientX - offset.current.x, window.innerWidth - width - 8));
    const y = Math.max(8, Math.min(event.clientY - offset.current.y, window.innerHeight - height - 8));
    setPos({ x, y });
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    // Clique (sem arraste): expande se minimizado, senão abre o modal.
    if (!moved.current) {
      if (isMinimized) setIsMinimized(false);
      else setIsModalOpen(true);
    }
  };

  const isVisible = isRunning && pathname !== MAIN_ROUTE;
  if (!isVisible) return null;

  const positionStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : { right: 24, bottom: 24 };

  const dragHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  };

  return createPortal(
    <>
      <div ref={widgetRef} style={positionStyle} className="fixed z-[90] select-none">
        {isMinimized ? (
          <div
            {...dragHandlers}
            title="Cronômetro ativo"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FCE7D6] shadow-lg cursor-grab active:cursor-grabbing touch-none"
          >
            <Clock className="w-5 h-5 text-[#F47B20]" />
          </div>
        ) : (
          <div
            {...dragHandlers}
            className="group flex items-center gap-2 rounded-full bg-[#FCE7D6] shadow-lg pl-4 pr-3 py-2 cursor-grab active:cursor-grabbing touch-none"
          >
            <Clock className="w-5 h-5 text-[#F47B20] shrink-0" />
            <span className="text-[18px] font-semibold tabular-nums text-[#F47B20]">
              {isStopping ? "Encerrando..." : formatHMS(elapsedTime)}
            </span>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIsMinimized(true)}
              className="p-0.5 rounded-full text-[#F47B20]/60 hover:text-[#F47B20] hover:bg-[#F47B20]/15 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Minimizar cronômetro"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStop}
        isLoading={isStopping}
        withInput={true}
        title="Encerrar horas"
        description="Tem certeza de que deseja encerrar o relatório de horas atual?"
        warningMessage="Uma vez encerrado, alterações no registro estarão sujeitas à aprovação."
        confirmText="Encerrar Ponto"
        cancelText="Voltar"
        inputMinLength={MIN_CHARS}
        inputMaxLength={MAX_CHARS}
      />
    </>,
    document.body,
  );
}
