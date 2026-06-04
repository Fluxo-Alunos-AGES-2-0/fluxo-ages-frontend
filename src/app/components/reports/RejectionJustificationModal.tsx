import { Modal } from "../ui/Modal/Modal";

interface RejectionJustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  justification: string | null;
}

export function RejectionJustificationModal({
  isOpen,
  onClose,
  justification,
}: RejectionJustificationModalProps) {
  if (!justification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Justificativa de rejeição"
      className="max-w-[500px]"
    >
      <div className="text-[#374151]">
        <div className="mb-2">
          <div
            className="max-h-[360px] overflow-y-auto border border-gray-200 rounded-xl p-4 bg-white text-[14px] text-gray-600 leading-relaxed whitespace-pre-line
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-button]:hidden"
          >
            {justification}
          </div>
        </div>
      </div>
    </Modal>
  );
}
