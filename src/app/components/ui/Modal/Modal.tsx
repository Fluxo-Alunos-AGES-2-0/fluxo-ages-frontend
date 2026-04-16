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
      className={`fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl min-w-[420px] z-[10000] border-l-4 border-blue-500"
      >
        <div className="flex justify-between items-center">
          <h2>{title}</h2>
          <div className="flex items-center gap-2">
            {categoria && (
              <span className="bg-sky-100 text-sky-600 px-2.5 py-1 rounded-full text-xs font-medium">
                {categoria}
              </span>
            )}
            <button onClick={onClose}>X</button>
          </div>
        </div>

        <div className="mt-3">
          {data && horario && (
            <div className="flex gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center">
                  <Calendar size={16} className="text-slate-500" />
                </div>
                <p className="m-0 text-sm text-slate-600">{data}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center">
                  <Clock4 size={16} className="text-slate-500" />
                </div>
                <p className="m-0 text-sm text-slate-600">{horario}</p>
              </div>
            </div>
          )}
          {children}
        </div>

        <div className="flex justify-end">{footer}</div>
      </div>
    </div>
  );
}
