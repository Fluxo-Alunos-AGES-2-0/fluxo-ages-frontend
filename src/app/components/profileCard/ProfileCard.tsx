import { useState } from "react";
import { Card } from "../Card/Card";
import { Folder, GraduationCap, CircleStar, ChevronRight } from "lucide-react";
import { ProfileData } from "../../types/dashboard";
import { toAgesLevel } from "@/app/utils/agesLevel";
import { FrequenciaModal } from "./FrequenciaModal";

interface ProfileCardProps {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

function ProfileCard({ profile, loading, error }: ProfileCardProps) {
  const [isFrequenciaModalOpen, setIsFrequenciaModalOpen] = useState(false);

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
          <div className="w-14 h-14 rounded-full bg-gray-200" />

          <div className="w-3/5 h-4 rounded bg-gray-200" />

          <div className="w-2/5 h-3 rounded bg-gray-200" />

          <div className="w-full h-3.5 rounded bg-gray-200" />

          <div className="w-full h-3.5 rounded bg-gray-200" />

          <div className="w-full h-3.5 rounded bg-gray-200" />
        </div>
      </Card>
    );
  }

  return (
    <>
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
              <h3 className="font-semibold">{nome}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Folder size={16} />
            </div>

            <div>
              <small className="text-xs text-muted-foreground">
                PROJETO ATUAL
              </small>

              <p className="font-medium">{projeto}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <GraduationCap size={16} />
            </div>

            <div>
              <small className="text-xs text-muted-foreground">PROFESSOR</small>

              <p className="font-medium">{professor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <CircleStar size={16} />
            </div>

            <div>
              <small className="text-xs text-muted-foreground">NÍVEL AGES</small>

              <p className="font-medium">{agesLevel}</p>
            </div>
          </div>

          <hr />

          {/* Frequência - clickable section */}
          <button
            className="flex flex-col gap-2 p-3 rounded-lg cursor-pointer border-none bg-transparent w-full hover:bg-slate-50 transition-colors group"
            onClick={() => setIsFrequenciaModalOpen(true)}
            aria-label="Ver detalhes de frequência"
          >
            <div className="flex items-center justify-between w-full">
              <small className="text-xs text-muted-foreground font-medium tracking-wide">
                FREQUÊNCIA
              </small>
              <ChevronRight
                size={14}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>

            <div className="flex justify-between items-center gap-3 w-full opacity-70">
              <div className="flex flex-col items-center">
                <span className="text-sm">Aulas</span>
                <b>{aulas}</b>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm">Presenças</span>
                <b className="text-green-600">{presencas}</b>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm">Faltas</span>
                <b className="text-red-600">{faltas}</b>
              </div>
            </div>
          </button>
        </div>
      </Card>

      <FrequenciaModal
        isOpen={isFrequenciaModalOpen}
        onClose={() => setIsFrequenciaModalOpen(false)}
      />
    </>
  );
}

export default ProfileCard;
