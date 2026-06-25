import { useState, useRef, useEffect } from "react";
import { Card } from "../Card/Card";
import { Folder, GraduationCap, CircleStar, Camera, LoaderCircle, Calendar, ChevronRight } from "lucide-react";
import { ProfileData } from "../../types/dashboard";
import { toAgesLevel } from "@/app/utils/agesLevel";
import { FrequenciaModal } from "../profileCard/FrequenciaModal";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { mockAttendanceData, type AttendanceDay } from "../../data/mockAttendance";

interface ProfileCardProps {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

function ProfileCard({ profile, loading, error }: ProfileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { showToast } = useToast();
  const { user, updateUser } = useAuth();

  const nome = profile?.name || "Usuário";
  const email = profile?.email || "";
  const projeto = profile?.currentProject?.name || "Sis. Gestão Acadêmica";
  const professor = profile?.professor?.name || "Prof. João Silva";
  const aulas = profile?.attendance?.totalClasses ?? "24";
  const presencas = profile?.attendance?.presences ?? "12";
  const faltas = profile?.attendance?.absences ?? "12";

  const agesLevel = toAgesLevel(profile?.agesLevel);

  const currentAvatarUrl = user?.avatarUrl || profile?.avatarUrl;

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

  // Fecha o modo de edição ao clicar fora do card
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast({
        variant: "error",
        title: "Erro de formato",
        message: "Formato inválido. Use JPG, PNG ou WEBP.",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast({
        variant: "error",
        title: "Erro de tamanho",
        message: "Arquivo muito grande. Máximo de 5MB.",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      await api.put('/students/me/avatar', formData);
      
      const response = await api.get<{ avatarUrl: string }>('/students/me');
      
      if (response && response.avatarUrl) {
        updateUser({ avatarUrl: response.avatarUrl });
      }

      showToast({
        variant: "success",
        title: "Sucesso",
        message: "Foto de perfil atualizada!",
      });
      
      setIsEditing(false);
    } catch (err) {
      showToast({
        variant: "error",
        title: "Erro",
        message: "Ocorreu um problema ao salvar a imagem.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  

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
    <div ref={cardRef} className="h-full">
      <Card 
        title="Perfil do Estudante" 
        headerAction={
          <button className={`text-sm font-medium transition-colors cursor-pointer text-slate-400 hover:text-slate-600`}>
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        } 
        headerActionOnClick={() => setIsEditing(!isEditing)}
      >
        <div className="flex flex-col gap-5">
          
          <div className="flex items-center gap-4">
            
            {/* Input escondido */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".png, .jpg, .jpeg, .webp"
              className="hidden"
            />

            {/* Avatar com overlay de edição */}
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden select-none transition-all ${
                isEditing && !isUploading ? 'cursor-pointer ring-2 ring-[#3b5ccc] ring-offset-2 hover:shadow-md' : ''
              }`}
              style={{ backgroundColor: currentAvatarUrl ? 'transparent' : corAvatar }}
              onClick={() => isEditing && !isUploading && fileInputRef.current?.click()}
            >
              {currentAvatarUrl ? (
                <img src={currentAvatarUrl} alt={nome} className="w-full h-full object-cover" />
              ) : (
                iniciais
              )}

              {/* Overlay de Câmera/Spinner ativado ao passar o mouse ou durante o loading */}
              {isEditing && (
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                  {isUploading ? (
                    <LoaderCircle size={22} className="animate-spin text-white" />
                  ) : (
                    <Camera size={22} className="text-white" />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-slate-800 text-lg leading-tight">{nome}</h3>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <Folder size={18} />
              </div>
              <div className="flex flex-col">
                <small className="text-[11px] font-bold text-slate-400">PROJETO ATUAL</small>
                <p className="font-medium text-slate-700 text-sm">{projeto}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <GraduationCap size={18} />
              </div>
              <div className="flex flex-col">
                <small className="text-[11px] font-bold text-slate-400">PROFESSOR</small>
                <p className="font-medium text-slate-700 text-sm">{professor}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <CircleStar size={18} />
              </div>
              <div className="flex flex-col">
                <small className="text-[11px] font-bold text-slate-400">NÍVEL AGES</small>
                <p className="font-medium text-slate-700 text-sm">{agesLevel}</p>
              </div>
            </div>
          </div>

          {/* Container de Frequência */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col gap-3 p-4 mt-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 w-full cursor-pointer text-left"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#3b5ccc]" />
                <span className="text-xs font-bold text-slate-600 tracking-wide">FREQUÊNCIA</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>

            <div className="flex justify-between items-center w-full px-2 pt-1">
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-slate-500 mb-0.5">Aulas</span>
                <b className="text-slate-800 text-sm">{aulas}</b>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-slate-500 mb-0.5">Presenças</span>
                <b className="text-green-600 text-sm">{presencas}</b>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-slate-500 mb-0.5">Faltas</span>
                <b className="text-red-600 text-sm">{faltas}</b>
              </div>
            </div>
          </button>
        </div>

        <FrequenciaModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Card>
    </div>
  );
}

export default ProfileCard;