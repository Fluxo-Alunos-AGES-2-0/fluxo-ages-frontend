import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Toast as ToastType, useToast } from "@/app/context/ToastContext";

const ANIMATION_DURATION = 300;

interface ToastItemProps {
  toast: ToastType;
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => removeToast(toast.id), ANIMATION_DURATION);
  };

  const isSuccess = toast.variant === "success";
  const bg = isSuccess ? "bg-[#22c55e]" : "bg-[#ef4444]";
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-[360px] w-full",
        bg,
        "transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
      ].join(" ")}
    >
      <Icon className="w-5 h-5 text-white shrink-0 mt-0.5" strokeWidth={2.5} />

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-snug">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-white/90 text-sm leading-snug mt-0.5">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="shrink-0 text-white/70 hover:text-white transition-colors mt-0.5 cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div
      aria-label="Notificações"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}