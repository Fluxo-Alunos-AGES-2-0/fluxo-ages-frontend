import { RefreshCw, X } from "lucide-react";
import { useNavigate } from "react-router"; // <-- Import adicionado
import { useOnboarding } from "@/app/components/Onboarding/OnboardingContext";
import { Button } from "@/app/components/ui/Button/Button";

interface ResetOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetOnboardingModal({
  isOpen,
  onClose,
}: ResetOnboardingModalProps) {
  const { resetOnboarding } = useOnboarding();
  const navigate = useNavigate(); 

  const handleConfirm = () => {
    navigate("/dashboard"); 
    resetOnboarding();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#3b5ccc] to-[#5b7ae8]" />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef1fb] flex items-center justify-center text-[#3b5ccc]">
                <RefreshCw size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#1f2937] m-0 leading-tight">
                  Refazer o Tour
                </h2>
                <p className="text-[13px] text-[#6b7280] m-0 mt-0.5">
                  Onboarding do Fluxo AGES
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#6b7280] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          <div className="border-t border-[#e5e7eb] my-4" />

          <p className="text-[14px] text-[#4b5563] leading-relaxed mb-6">
            Isso irá reiniciar o tour de apresentação de todas as páginas.
            Na próxima vez que você visitar o{" "}
            <strong>Dashboard</strong>, <strong>Relatórios</strong> e{" "}
            <strong>Mapa de Projetos</strong>, o guia será exibido
            novamente.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
              className="!border-[#e5e7eb] !text-[#6b7280]"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleConfirm}
              className="!bg-[#3b5ccc]"
            >
              <RefreshCw size={15} />
              Reiniciar Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}