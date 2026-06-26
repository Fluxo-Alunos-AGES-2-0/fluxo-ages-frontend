import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { X, ChevronLeft, ChevronRight, CheckCheck } from "lucide-react";
import { useOnboarding } from "@/app/components/Onboarding/OnboardingContext";

export interface OnboardingStep {
  target: string; 
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: "top" | "bottom" | "left" | "right";
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 12;
const TOOLTIP_W = 320;
const TOOLTIP_H = 180; 

function getPlacement(
  rect: DOMRect,
  preferred: "top" | "bottom" | "left" | "right" | undefined,
  tooltipH: number,
): "top" | "bottom" | "left" | "right" {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pref = preferred ?? "bottom";
  const fits = {
    bottom: rect.bottom + tooltipH + PADDING * 2 < vh,
    top: rect.top - tooltipH - PADDING * 2 > 0,
    right: rect.right + TOOLTIP_W + PADDING * 2 < vw,
    left: rect.left - TOOLTIP_W - PADDING * 2 > 0,
  };
  if (fits[pref]) return pref;
  const order: Array<"bottom" | "top" | "right" | "left"> = [
    "bottom",
    "top",
    "right",
    "left",
  ];
  return order.find((d) => fits[d]) ?? "bottom";
}

function calcTooltipPos(
  rect: DOMRect,
  placement: "top" | "bottom" | "left" | "right",
  tooltipH: number,
): { top: number; left: number } {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Mantém o tooltip dentro da viewport nos dois eixos, usando a altura real do
  // tooltip (tooltipH). Sem o clamp vertical, um alvo grande/baixo (ex.: a grade
  // do mapa de projetos) empurra o tooltip para baixo da tela.
  const clampX = (x: number) =>
    Math.min(Math.max(x, PADDING), vw - TOOLTIP_W - PADDING);
  const clampY = (y: number) =>
    Math.min(Math.max(y, PADDING), vh - tooltipH - PADDING);

  switch (placement) {
    case "bottom":
      return {
        top: clampY(rect.bottom + PADDING),
        left: clampX(centerX - TOOLTIP_W / 2),
      };
    case "top":
      return {
        top: clampY(rect.top - tooltipH - PADDING),
        left: clampX(centerX - TOOLTIP_W / 2),
      };
    case "right":
      return {
        top: clampY(centerY - tooltipH / 2),
        left: clampX(rect.right + PADDING),
      };
    case "left":
      return {
        top: clampY(centerY - tooltipH / 2),
        left: clampX(rect.left - TOOLTIP_W - PADDING),
      };
  }
}

interface Props {
  steps: OnboardingStep[];
}

export function OnboardingTooltip({ steps }: Props) {
  const { isActive, currentStep, nextStep, prevStep, finishOnboarding, skipOnboarding, totalSteps } =
    useOnboarding();

  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  const updatePosition = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tooltipH = tooltipRef.current?.offsetHeight || TOOLTIP_H;
    const placement = getPlacement(rect, step.placement, tooltipH);
    const { top, left } = calcTooltipPos(rect, placement, tooltipH);

    setTooltipPos({ top, left, placement });
    setSpotlight({
      top: rect.top - PADDING / 2,
      left: rect.left - PADDING / 2,
      width: rect.width + PADDING,
      height: rect.height + PADDING,
    });
  }, [step]);

  useLayoutEffect(() => {
    if (!isActive || !step) {
      setVisible(false);
      return;
    }

    setVisible(false);
    const t = setTimeout(() => {
      const el = document.querySelector(step.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      
      updatePosition();
      setVisible(true);
    }, 80);

    return () => clearTimeout(t);
  }, [isActive, currentStep, step, updatePosition]);

  useEffect(() => {
    if (!isActive) return;

    let rafId: number;
    const onUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true); 

    return () => {
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
      cancelAnimationFrame(rafId);
    };
  }, [isActive, updatePosition]);

  // Após ficar visível, reposiciona usando a altura real do tooltip já montado
  // (a estimativa TOOLTIP_H pode subestimar o conteúdo e deixar a base fora da tela).
  useLayoutEffect(() => {
    if (visible) updatePosition();
  }, [visible, updatePosition]);

  useEffect(() => {
    if (visible && tooltipRef.current) {
      tooltipRef.current.focus();
    }
  }, [visible]);

  if (!isActive || !step || !tooltipPos || !spotlight) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const r = 8; 

  const cutout = [
    `M 0 0 H ${vw} V ${vh} H 0 Z`,
    `M ${spotlight.left + r} ${spotlight.top}`,
    `H ${spotlight.left + spotlight.width - r}`,
    `Q ${spotlight.left + spotlight.width} ${spotlight.top} ${spotlight.left + spotlight.width} ${spotlight.top + r}`,
    `V ${spotlight.top + spotlight.height - r}`,
    `Q ${spotlight.left + spotlight.width} ${spotlight.top + spotlight.height} ${spotlight.left + spotlight.width - r} ${spotlight.top + spotlight.height}`,
    `H ${spotlight.left + r}`,
    `Q ${spotlight.left} ${spotlight.top + spotlight.height} ${spotlight.left} ${spotlight.top + spotlight.height - r}`,
    `V ${spotlight.top + r}`,
    `Q ${spotlight.left} ${spotlight.top} ${spotlight.left + r} ${spotlight.top} Z`,
  ].join(" ");

  const arrowClasses: Record<string, string> = {
    bottom:
      "absolute -top-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white",
    top: "absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white",
    right:
      "absolute top-1/2 -left-2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white",
    left: "absolute top-1/2 -right-2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white",
  };

  const isArrowOnTop = tooltipPos.placement === "bottom";

  return (
    <>
      <svg
        className="fixed inset-0 z-[9990] pointer-events-none transition-all duration-300"
        width={vw}
        height={vh}
        style={{ top: 0, left: 0 }}
      >
        <path
          d={cutout}
          fill="rgba(0,0,0,0.5)"
          fillRule="evenodd"
        />
      </svg>

      <div
        className="fixed inset-0 z-[9992] cursor-default"
        onClick={skipOnboarding}
      />

      <div
        ref={tooltipRef}
        tabIndex={-1}
        className={`fixed z-[9993] outline-none transition-all duration-200 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: TOOLTIP_W,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          
          {!isArrowOnTop && (
            <div className="h-1 w-full bg-gradient-to-r from-[#3b5ccc] to-[#5b7ae8] shrink-0" />
          )}

          <div className="p-5 flex-1">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3b5ccc] bg-[#eef1fb] px-2 py-0.5 rounded-full">
                    {currentStep + 1} de {totalSteps}
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-[#1f2937] leading-tight m-0">
                  {step.title}
                </h3>
              </div>
              <button
                onClick={skipOnboarding}
                className="w-6 h-6 flex items-center justify-center rounded-full text-[#6b7280] hover:bg-gray-100 transition-colors cursor-pointer shrink-0 mt-0.5"
                aria-label="Fechar onboarding"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[13px] text-[#4b5563] leading-relaxed m-0 mb-4">
              {step.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-200 ${
                      i === currentStep
                        ? "w-4 h-2 bg-[#3b5ccc]"
                        : i < currentStep
                          ? "w-2 h-2 bg-[#3b5ccc]/40"
                          : "w-2 h-2 bg-[#e5e7eb]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {!isFirst && (
                  <button
                    onClick={prevStep}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:bg-gray-50 transition-colors cursor-pointer"
                    aria-label="Passo anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}

                <button
                  onClick={isLast ? finishOnboarding : nextStep}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3b5ccc] text-white text-[13px] font-semibold hover:bg-[#2f4bb0] transition-colors cursor-pointer"
                >
                  {isLast ? (
                    <>
                      <CheckCheck size={14} />
                      Concluir
                    </>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Barra renderizada no rodapé SE a seta ESTIVER no topo */}
          {isArrowOnTop && (
            <div className="h-1 w-full bg-gradient-to-r from-[#3b5ccc] to-[#5b7ae8] shrink-0" />
          )}

        </div>

        {/* SETA DO POPOVER */}
        <div className={arrowClasses[tooltipPos.placement]} />

      </div>
    </>
  );
}