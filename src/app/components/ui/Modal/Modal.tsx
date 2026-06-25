import { useEffect, useRef, useState } from "react";
import { Calendar, Clock4 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  data?: string;
  horario?: string;
  categoria?: string;
  className?: string; 
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  data,
  horario,
  categoria,
  className = "", 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      if (!modalRef.current.contains(document.activeElement)) {
        e.preventDefault();
        focusable[0].focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`relative bg-white dark:bg-[#1E293B] p-6 rounded-xl w-full max-w-md z-[10000] shadow-2xl overflow-hidden border border-transparent dark:border-[#334155] ${className}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F47B20] to-[#f18a3c] z-10 rounded-t-xl" />
        <div className="flex justify-between items-center">
          <h2 className="text-[24px] font-bold text-black dark:text-[#F4F6F7]">{title}</h2>
          <div className="flex items-center gap-2">
            {categoria && (
              <span className="bg-sky-100 dark:bg-[#334155] text-sky-600 dark:text-[#94A3B8] px-2.5 py-1 rounded-full text-xs font-medium">
                {categoria}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          {data && horario && (
            <div className="flex gap-6 mt-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center">
                  <Calendar size={16} className="text-slate-500 dark:text-[#94A3B8]" />
                </div>
                <p className="m-0 text-sm text-slate-600 dark:text-[#94A3B8]">{data}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center">
                  <Clock4 size={16} className="text-slate-500 dark:text-[#94A3B8]" />
                </div>
                <p className="m-0 text-sm text-slate-600 dark:text-[#94A3B8]">{horario}</p>
              </div>
            </div>
          )}
          {children}
        </div>

        {footer && <div className="flex justify-end mt-4">{footer}</div>}
      </div>
    </div>
  );
}
