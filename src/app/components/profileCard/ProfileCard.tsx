import { useState } from "react";
import { Card } from "@/app/components/Card/Card";
import { Folder, GraduationCap, CircleStar } from "lucide-react";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  agesLevel: number;
  currentProject: { id: number; name: string } | null;
  professor: { id: number; name: string } | null;
  attendance: { totalClasses: number; presences: number; absences: number };
}

interface ProfileCardProps {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

function gerarCor(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function ProfileCard({ profile, loading, error }: ProfileCardProps) {
  if (loading) {
    return (
      <Card title="Perfil do Estudante">
        <div className="flex flex-col gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
          <div className="w-3/5 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-2/5 h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-3.5 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-3.5 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-3.5 bg-gray-200 rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card title="Perfil do Estudante">
        <p className="text-sm text-red-500">
          {error ?? "Erro ao carregar perfil."}
        </p>
      </Card>
    );
  }

  const [imgError, setImgError] = useState(false);
  const iniciais = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
  const corAvatar = gerarCor(profile.name);
  const agesLabel = `AGES ${ROMAN[profile.agesLevel - 1] ?? profile.agesLevel}`;

  return (
    <Card title="Perfil do Estudante" headerAction={<button>Editar</button>}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {profile.avatarUrl && !imgError ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-14 h-14 rounded-full object-cover shrink-0"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: corAvatar }}
            >
              {iniciais}
            </div>
          )}
          <div>
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
          </div>
        </div>

        {profile.currentProject && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Folder size={16} />
            </div>
            <div>
              <small className="text-gray-400 text-xs">PROJETO ATUAL</small>
              <p className="m-0 font-medium">{profile.currentProject.name}</p>
            </div>
          </div>
        )}

        {profile.professor && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
            <div>
              <small className="text-gray-400 text-xs">PROFESSOR</small>
              <p className="m-0 font-medium">{profile.professor.name}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <CircleStar size={16} />
          </div>
          <div>
            <small className="text-gray-400 text-xs">NÍVEL AGES</small>
            <p className="m-0 font-medium">{agesLabel}</p>
          </div>
        </div>

        <hr />

        <button
          className="opacity-70 flex justify-between items-center gap-3 p-3 rounded-lg cursor-pointer border-none bg-transparent w-full"
          onClick={() => {}}
        >
          <div className="flex flex-col items-center">
            Aulas <b>{profile.attendance.totalClasses}</b>
          </div>
          <div className="flex flex-col items-center">
            Presenças{" "}
            <b className="text-green-600">{profile.attendance.presences}</b>
          </div>
          <div className="flex flex-col items-center">
            Faltas <b className="text-red-600">{profile.attendance.absences}</b>
          </div>
        </button>
      </div>
    </Card>
  );
}
