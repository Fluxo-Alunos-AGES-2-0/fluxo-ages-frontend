import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../Button/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  warningMessage?: string;
  confirmText?: string;
  cancelText?: string;
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
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[12px] w-[570px] h-[360px] flex flex-col overflow-hidden">
        
        <div className="px-10 py-3 text-left">
          <h2 className="text-[24px] font-semibold text-[#1f2937]">{title}</h2>
        </div>

        <div className="border-t border-slate-100" />

        <div className="px-10 py-8 flex flex-col gap-10 justify-between text-left">
          
          <div className="flex flex-col gap-10">
            <p className="text-base text-slate-600">{description}</p>

            {warningMessage && (
              <div className="flex items-start gap-3 bg-[#FFE0CC] p-4 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-[#D16212] shrink-0 mt-0.5" />
                <p className="text-sm text-[#D16212]">{warningMessage}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
              className="!border-[#e5e7eb] !text-[#f47b20] !bg-transparent "
            >
              {cancelText}
            </Button>
            
            <Button
              variant="primary"
              fullWidth
              onClick={onConfirm}
              className="!bg-[#f47b20]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};