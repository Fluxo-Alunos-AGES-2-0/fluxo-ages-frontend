import { useEffect, useRef, useState } from "react";
import { Clock, X } from "lucide-react";
import { Button } from "../ui/Button/Button";
import { mockAttendanceData, type AttendanceDay } from "../../data/mockAttendance";

interface FrequenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FrequenciaModal({ isOpen, onClose }: FrequenciaModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
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

  // Trap focus inside modal
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
      className={`fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-2xl z-[10000] w-full max-w-[460px] mx-4 overflow-hidden"
      >
        {/* Blue accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3b5ccc] to-[#5b7ae8] z-10 rounded-t-xl" />

        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-7 pb-4">
          <h2 className="text-[24px] font-bold text-[#1f2937]">Frequência</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 pb-4 max-h-[60vh] overflow-y-auto flex flex-col gap-5">
          {mockAttendanceData.map((day: AttendanceDay) => (
            <div key={day.date} className="flex flex-col gap-2">
              {/* Date heading */}
              <p className="text-base font-semibold text-[#1f2937]">
                {day.date}
              </p>

              {/* Slots */}
              {day.slots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-[#f47b20]" />
                    <span className="text-sm text-[#374151]">{slot.time}</span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      slot.status === "Presente"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <Button
            variant="primary"
            fullWidth
            onClick={onClose}
            className="!bg-[#f47b20] hover:!bg-[#d96a18]"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
