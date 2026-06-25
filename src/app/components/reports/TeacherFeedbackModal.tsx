import { Button } from "../ui/Button/Button";
import { Modal } from "../ui/Modal/Modal";

interface TeacherFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    feedback: {
      comment: string | null;
      revisionDate?: string | null;
      teacherName?: string | null;
    } | null;
  } | null;
}

export function TeacherFeedbackModal({
  isOpen,
  onClose,
  reportData,
}: TeacherFeedbackModalProps) {
  if (!reportData) return null;

  const hasFeedback = Boolean(reportData.feedback?.comment);

  const handleDownloadFeedback = () => {
    const commentText = reportData.feedback?.comment;
    if (!commentText) return;

    const blob = new Blob([commentText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "feedback-professor.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Feedback do professor"
      className="max-w-[500px]"
    >
      <div className="text-[#374151] dark:text-[#F4F6F7]">
        <p className="text-[14px] text-gray-400 dark:text-[#94A3B8] border-b border-gray-100 dark:border-[#31405A] pb-3 mb-4">
          {reportData.feedback?.teacherName || "Professor"}
        </p>

        {/* Seção de Comentário */}
        <div className="mb-2">
          <h4 className="text-[14px] font-medium text-gray-500 dark:text-[#94A3B8] mb-2">
            Comentário
          </h4>

          <div
            className="max-h-[360px] overflow-y-auto border border-gray-200 dark:border-[#31405A] rounded-xl p-4 bg-white dark:bg-[#1E293B] text-[14px] leading-relaxed whitespace-pre-line
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-button]:hidden"
          >
            {hasFeedback ? (
              <span className="text-gray-600 dark:text-[#94A3B8]">
                {reportData.feedback?.comment}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-[#94A3B8] italic">
                Nenhum feedback enviado ainda.
              </span>
            )}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            variant="accent-secondary"
            fullWidth
            onClick={onClose}
          >
            Fechar
          </Button>

          <Button
            variant="accent"
            fullWidth
            disabled={!hasFeedback}
            title={
              hasFeedback
                ? "Baixar feedback do professor"
                : "Nenhum feedback disponível"
            }
            onClick={handleDownloadFeedback}
          >
            Baixar
          </Button>
        </div>
      </div>
    </Modal>
  );
}