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
      <div className="text-[#374151] dark:text-[#F4F6F7]">
        <div className="mb-2">
          <div
            className="max-h-[360px] overflow-y-auto border border-gray-200 dark:border-[#334155] rounded-xl p-4 bg-white dark:bg-[#334155] text-[14px] text-gray-600 dark:text-[#F4F6F7] leading-relaxed whitespace-pre-line
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-200
          dark:[&::-webkit-scrollbar-thumb]:bg-[#64748B]
            [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-[#94A3B8]
            [&::-webkit-scrollbar-button]:hidden"
          >
            {justification}
          </div>
        </div>
      </div>
    </Modal>
  );
}
