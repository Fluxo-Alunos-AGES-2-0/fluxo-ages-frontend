import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../Button/Button";
import { TextArea } from "../TextArea/TextArea";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (description?: string) => Promise<void>; // Aceita descrição opcional
  title: string;
  description: string;
  warningMessage?: string;
  confirmText?: string;
  cancelText?: string;
  withInput?: boolean;
  isLoading?: boolean;
  inputMinLength?: number;
  inputMaxLength?: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  warningMessage,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  withInput = false,
  isLoading = false,
  inputMinLength = 0,
  inputMaxLength = 1250,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setError(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (withInput) {
      const trimmedValue = inputValue.trim();

      if (trimmedValue.length < inputMinLength) {
        setError(
          `A descrição deve ter no mínimo ${inputMinLength} caracteres.`,
        );
        return;
      }

      if (trimmedValue.length > inputMaxLength) {
        setError(
          `A descrição excedeu o limite de ${inputMaxLength} caracteres.`,
        );
        return;
      }

      setError(undefined);
      await onConfirm(trimmedValue);
    } else {
      await onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[#334155] rounded-[12px] w-full max-w-[570px] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-10 py-5 text-left">
          <h2 className="text-[24px] font-semibold text-[#1f2937] dark:text-[#F4F6F7]">{title}</h2>
        </div>

        <div className="border-t border-slate-100 dark:border-[#334155]" />

        {/* Content */}
        <div className="px-10 py-8 flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-4">
            <p className="text-base text-slate-600 dark:text-[#F4F6F7]">{description}</p>

            {/* Input de Descrição Condicional */}
            {withInput && (
              <TextArea
                label="Descrição das atividades"
                placeholder="O que você desenvolveu nesse período?"
                value={inputValue}
                onChange={(val) => {
                  setInputValue(val);
                  if (val.trim().length >= 15) setError(undefined);
                }}
                error={error}
                maxLength={1250}
              />
            )}

            {warningMessage && (
              <div className="flex items-start gap-3 bg-[#FFE0CC] p-4 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-[#D16212] shrink-0 mt-0.5" />
                <p className="text-sm text-[#D16212]">{warningMessage}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
              className="!border-[#e5e7eb] !text-[#f47b20] !bg-transparent"
            >
              {cancelText}
            </Button>

            <Button
              variant="primary"
              fullWidth
              onClick={handleConfirm}
              disabled={isLoading}
              className="!bg-[#f47b20]"
            >
              {isLoading ? "Processando..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
