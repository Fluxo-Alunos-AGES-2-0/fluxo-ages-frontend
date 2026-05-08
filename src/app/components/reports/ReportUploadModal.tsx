import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui/Modal/Modal";
import { Upload, ChevronDown, Check, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportUploadModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ReportUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Fluxo AGES 2.0 - Alunos");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      showToast("error", "Selecione um arquivo PDF.");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast("error", "Arquivo excede o limite de 25MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      // TODO: integrar com endpoint real de upload quando o backend estiver pronto
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast("success", "Relatório enviado!");
      onSuccess();
      onClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Erro ao enviar relatório:", error);
      showToast("error", "Falha no envio.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Relatório de Andamento"
    >
      <div className="flex flex-col gap-6 p-2 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#6b7280]">
              Aluno
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Digite o nome do aluno"
              className="h-[42px] px-4 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] text-[#374151] text-[14px] focus:outline-none focus:border-[#3b5ccc]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#6b7280]">
              Time<span className="text-[#f97316] ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="appearance-none w-full h-[42px] px-4 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] text-[#374151] text-[14px] cursor-pointer focus:outline-none"
              >
                <option value="Fluxo AGES 2.0 - Alunos">
                  Fluxo AGES 2.0 - Alunos
                </option>
                <option value="Fluxo AGES 2.0 - Desenvolvedores">
                  Fluxo AGES 2.0 - Desenvolvedores
                </option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-[#6b7280]">
            Arquivo<span className="text-[#f97316] ml-0.5">*</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`group relative h-[48px] flex items-center justify-between px-4 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
              selectedFile
                ? "border-[#f97316] bg-[#fff7ed]"
                : "border-[#e5e7eb] bg-[#f8fafc]"
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
              className={`text-[14px] truncate pr-4 ${selectedFile ? "text-[#f97316] font-medium" : "text-[#9ca3af]"}`}
            >
              {selectedFile ? selectedFile.name : "Escolha o seu arquivo (PDF)"}
            </span>
            <Upload
              size={20}
              className="text-[#f97316] flex-shrink-0"
              strokeWidth={2.5}
            />
          </div>
          <span className="text-[11px] text-[#9ca3af]">
            Limite de 25MB por arquivo.
          </span>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl border border-[#e5e7eb] text-[#f97316] font-bold text-[15px] hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-8 py-2.5 rounded-xl font-bold text-[15px] text-white transition-all shadow-md ${
              !selectedFile || isUploading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#f97316] hover:bg-[#ea580c]"
            }`}
          >
            {isUploading ? "Enviando..." : "Enviar Relatório"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
