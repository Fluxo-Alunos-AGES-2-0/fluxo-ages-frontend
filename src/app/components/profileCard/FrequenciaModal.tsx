import { Clock } from "lucide-react";
import { Modal } from "../ui/Modal/Modal";
import { Button } from "../ui/Button/Button";
import { mockAttendanceData, type AttendanceDay } from "../../data/mockAttendance";

interface FrequenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FrequenciaModal({ isOpen, onClose }: FrequenciaModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Frequência"
      className="!max-w-2xl"
      footer={
        <Button
          variant="primary"
          fullWidth
          onClick={onClose}
          className="!bg-[#f47b20] hover:!bg-[#d96a18]"
        >
          Fechar
        </Button>
      }
    >
      <hr className="border-t border-gray-200 mb-4" />

     <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {mockAttendanceData.map((day: AttendanceDay) => (
          <div key={day.date} className="flex flex-col gap-2">
            <p className="text-base font-semibold text-[#1f2937]">{day.date}</p>

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
                    slot.status === "Presente" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
