import { useState } from "react";
import { Card } from "../Card/Card";
import { Folder, GraduationCap, CircleStar } from "lucide-react";
import { ProfileData } from "../../types/dashboard";
import { toAgesLevel } from "@/app/utils/agesLevel";
import { FrequenciaModal } from "../profileCard/FrequenciaModal";

interface ProfileCardProps {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

function ProfileCard({ profile, loading, error }: ProfileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nome = profile?.name || "Usuário";
  const email = profile?.email || "";
  const projeto = profile?.currentProject?.name || "Sis. Gestão Acadêmica";
  const professor = profile?.professor?.name || "Prof. João Silva";
  const aulas = profile?.attendance?.totalClasses ?? "24";
  const presencas = profile?.attendance?.presences ?? "12";
  const faltas = profile?.attendance?.absences ?? "12";

  const agesLevel = toAgesLevel(profile?.agesLevel);

  function gerarCor(nome: string) {
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 60%, 50%)`;
  }

  const iniciais = nome
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  const corAvatar = gerarCor(nome);

  if (loading) {
    return (
      <Card title="Perfil do Estudante">
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-[#334155]" />
          <div className="w-3/5 h-4 rounded bg-gray-200 dark:bg-[#334155]" />
          <div className="w-2/5 h-3 rounded bg-gray-200 dark:bg-[#334155]" />
          <div className="w-full h-3.5 rounded bg-gray-200 dark:bg-[#334155]" />
          <div className="w-full h-3.5 rounded bg-gray-200 dark:bg-[#334155]" />
          <div className="w-full h-3.5 rounded bg-gray-200 dark:bg-[#334155]" />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Perfil do Estudante" headerAction={<button>Editar</button>}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: corAvatar }}
          >
            {iniciais}
          </div>

          <div>
            <h3 className="font-semibold text-[#1f2937] dark:text-[#F4F6F7]">{nome}</h3>
            <p className="text-sm text-[#6b7280] dark:text-[#94A3B8]">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#334155] text-[#334155] dark:text-[#F4F6F7] flex items-center justify-center">
            <Folder size={16} />
          </div>

          <div>
            <small className="text-xs text-[#6b7280] dark:text-[#94A3B8]">
              PROJETO ATUAL
            </small>
            <p className="font-medium text-[#1f2937] dark:text-[#F4F6F7]">{projeto}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#334155] text-[#334155] dark:text-[#F4F6F7] flex items-center justify-center">
            <GraduationCap size={16} />
          </div>

          <div>
            <small className="text-xs text-[#6b7280] dark:text-[#94A3B8]">PROFESSOR</small>
            <p className="font-medium text-[#1f2937] dark:text-[#F4F6F7]">{professor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#334155] text-[#334155] dark:text-[#F4F6F7] flex items-center justify-center">
            <CircleStar size={16} />
          </div>

          <div>
            <small className="text-xs text-[#6b7280] dark:text-[#94A3B8]">NÍVEL AGES</small>
            <p className="font-medium text-[#1f2937] dark:text-[#F4F6F7]">{agesLevel}</p>
          </div>
        </div>

        <hr className="border-[#e5e7eb] dark:border-[#334155]"/>

        <button
          className="opacity-70 flex justify-between items-center gap-3 p-3 rounded-lg cursor-pointer border-none bg-transparent dark:bg-[#334155]/60 w-full hover:opacity-100 hover:bg-slate-50 dark:hover:bg-[#334155] transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-col items-center">
            <span className="text-[#6b7280] dark:text-[#94A3B8]">Aulas</span>
            <b className="text-[#1f2937] dark:text-[#F4F6F7]">{aulas}</b>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#6b7280] dark:text-[#94A3B8]">Presenças</span>
            <b className="text-green-600">{presencas}</b>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#6b7280] dark:text-[#94A3B8]">Faltas</span>
            <b className="text-red-600">{faltas}</b>
          </div>
        </button>
      </div>

      <FrequenciaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
}

export default ProfileCard;
