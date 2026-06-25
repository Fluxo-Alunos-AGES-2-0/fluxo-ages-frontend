import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui/Modal/Modal";
import { Upload, Check, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  confirmFinalReportUpload,
  confirmProgressReportUpload,
  createFinalReportUploadUrl,
  createProgressReportUploadUrl,
  uploadFileToPresignedUrl,
} from "../../services/reportUpload";
import { ConfirmationModal } from "../ui/ConfirmationModal/ConfirmationModal";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reportType?: "andamento" | "final";
  currentProject?: string;
  hasExistingReport?: boolean;
}

export const ReportUploadModal = ({
  isOpen,
  onClose,
  onSuccess,
  reportType = "andamento",
  currentProject = "",
  hasExistingReport = false
}: ReportUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!isOpen) {
      clearSelectedFile();
    }
  }, [isOpen]);

  const showToast = (type: "success" | "error", message: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-[280px] w-full shadow-md pointer-events-auto flex`}
        >
          <div
            className={`flex-1 p-2.5 flex items-center gap-2.5 ${type === "success" ? "bg-[#4caf50]" : "bg-[#e53935]"} rounded-sm`}
          >
            <div className="flex-shrink-0">
              {type === "success" ? (
                <Check className="text-white" size={18} strokeWidth={3} />
              ) : (
                <XCircle className="text-white" size={18} strokeWidth={3} />
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-bold text-white leading-none">
                {type === "success" ? "Sucesso" : "Erro"}
              </p>
              <p className="text-[11px] text-white opacity-90 mt-0.5 leading-tight">
                {message}
              </p>
            </div>
          </div>
        </div>
      ),
      { position: "top-right" },
    );
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  };

  const formatStageError = (error: unknown, fallback: string) => {
    const message = getErrorMessage(error, "").trim();

    if (!message || message === fallback || /^HTTP \d+$/.test(message)) {
      return fallback;
    }

    return `${fallback} ${message}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      showToast("error", "Selecione um arquivo PDF.");
      clearSelectedFile();
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast("error", "Arquivo excede o limite de 25MB.");
      clearSelectedFile();
      return;
    }

    setSelectedFile(file);
  };

  const getUploadUrl = async () => {
    try {
      return reportType === "final"
        ? await createFinalReportUploadUrl()
        : await createProgressReportUploadUrl();
    } catch (error) {
      throw new Error(
        formatStageError(
          error,
          "Não foi possível gerar a URL de upload do relatório.",
        ),
      );
    }
  };

  const confirmUpload = async (fileReference: string) => {
    try {
      if (reportType === "final") {
        await confirmFinalReportUpload(fileReference);
        return;
      }

      await confirmProgressReportUpload(fileReference);
    } catch (error) {
      throw new Error(
        formatStageError(
          error,
          reportType === "final"
            ? "Não foi possível confirmar o upload do relatório final."
            : "Não foi possível confirmar o upload do relatório de andamento.",
        ),
      );
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const uploadData = await getUploadUrl();

      try {
        await uploadFileToPresignedUrl(
          uploadData.uploadUrl,
          selectedFile,
          uploadData.contentType || "application/pdf",
        );
      } catch (error) {
        throw new Error(
          formatStageError(
            error,
            "Não foi possível enviar o PDF para o armazenamento.",
          ),
        );
      }

      await confirmUpload(uploadData.fileReference);

      showToast("success", "Relatório enviado com sucesso!");
      onSuccess();
      onClose();
      clearSelectedFile();
    } catch (error) {
      console.error("Erro ao enviar relatório:", error);
      showToast(
        "error",
        getErrorMessage(error, "Falha no envio do relatório."),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        reportType === "andamento"
          ? "Novo Relatório de Andamento"
          : "Novo Relatório Final"
      }
      className="!max-w-xl"
    >
      <div className="flex flex-col gap-6 p-2 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#6b7280] dark:text-[#94A3B8]">
              Estudante
            </label>
            <input
              type="text"
              value={user?.name ?? ""}
              disabled
              className="h-[42px] px-4 rounded-lg bg-[#f8fafc] dark:bg-[#334155] border border-[#e5e7eb] dark:border-[#334155] text-[#6b7280] dark:text-[#F4F6F7] text-[14px] cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#6b7280] dark:text-[#94A3B8]">
              Time<span className="text-[#f97316] ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={currentProject}
              disabled
              className="h-[42px] px-4 rounded-lg bg-[#f8fafc] dark:bg-[#334155] border border-[#e5e7eb] dark:border-[#334155] text-[#6b7280] dark:text-[#F4F6F7] text-[14px] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-[#6b7280] dark:text-[#94A3B8]">
            Arquivo<span className="text-[#f97316] ml-0.5">*</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`group relative h-[48px] flex items-center justify-between px-4 rounded-lg border-2 border-dashed transition-all cursor-pointer ${selectedFile
              ? "border-[#f97316] bg-[#fff7ed] dark:bg-[#334155]"
              : "border-[#e5e7eb] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#334155]"
              }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />
            <span
              className={`text-[14px] truncate pr-4 ${
                selectedFile
                  ? "text-[#f97316] font-medium"
                  : "text-[#9ca3af] dark:text-[#94A3B8]"
              }`}
            >
              {selectedFile ? selectedFile.name : "Escolha o seu arquivo (PDF)"}
            </span>
            <Upload
              size={20}
              className="text-[#f97316] flex-shrink-0"
              strokeWidth={2.5}
            />
          </div>
          <span className="text-[11px] text-[#9ca3af] dark:text-[#64748B]">
            Limite de 25MB por arquivo.
          </span>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl border border-[#e5e7eb] dark:border-[#334155] text-[#f97316] font-bold text-[15px] hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => hasExistingReport ? setIsConfirmationModalOpen(true) : handleUpload()}
            disabled={!selectedFile || isUploading}
            className={`px-8 py-2.5 rounded-xl font-bold text-[15px] text-white transition-all shadow-md ${!selectedFile || isUploading
              ? "bg-gray-300 dark:bg-[#64748B] cursor-not-allowed"
              : "bg-[#f97316] hover:bg-[#ea580c] cursor-pointer"
              }`}
          >
            {isUploading ? "Enviando..." : "Enviar Relatório"}
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleUpload}
        title="Confirmar Envio do Relatório"
        description={"Essa ação não é reversível e irá sobrescrever o relatório já existente. Deseja enviar mesmo assim?"}
      />
    </Modal>
  );
};
