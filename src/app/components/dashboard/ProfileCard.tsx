import { useState, useRef } from "react";
import { Mail, FolderOpen, Award, Pencil, Camera, X, Check, CalendarCheck, GraduationCap } from "lucide-react";

const STUDENT = {
  name: "Lucas Fernandes",
  email: "lucas.fernandes@edu.pucrs.br",
  project: "Sis. Gestão Acadêmica",
  role: "Desenvolvedor",
  level: "AGES III",
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-[6px] bg-[#F5F6FA] dark:bg-[#334155]/60 flex items-center justify-center flex-shrink-0">
        <span className="text-[#6B7280] dark:text-[#94A3B8]">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wide leading-none">
          {label}
        </p>
        <p
          className="text-sm text-[#1F2937] dark:text-[#F9FAFB] truncate mt-0.5"
          style={{ fontWeight: 500 }}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [editName, setEditName] = useState(STUDENT.name);
  const [editProject, setEditProject] = useState(STUDENT.project);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarSrc(url);
    }
  };

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => {
    setIsEditing(false);
    setEditName(STUDENT.name);
    setEditProject(STUDENT.project);
  };

  const initials = editName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="h-full bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] flex flex-col overflow-hidden transition-colors duration-300"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]" />

      {/* Header row */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#334155] px-[15px] py-[10px]">
        <span
          className="text-sm text-[#1F2937] dark:text-[#F9FAFB]"
          style={{ fontWeight: 600 }}
        >
          Perfil do Estudante
        </span>
        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-[6px] text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 transition-colors cursor-pointer"
                title="Cancelar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-[6px] bg-[#3B5CCC] dark:bg-[#4F6EF7] text-white hover:opacity-90 transition-opacity cursor-pointer"
                title="Salvar"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 hover:text-[#3B5CCC] dark:hover:text-[#4F6EF7] transition-colors cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              <span className="text-xs" style={{ fontWeight: 500 }}>
                Editar
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 px-[16px] py-[20px]">
        {/* Avatar + identity block */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3B5CCC] to-[#5B7AE8] flex items-center justify-center shadow-md overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-white text-lg"
                  style={{ fontWeight: 700 }}
                >
                  {initials}
                </span>
              )}
            </div>

            {/* Online dot */}
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-[#1E293B]" />

            {/* Camera overlay when editing */}
            {isEditing && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/55 transition-colors"
                  title="Alterar foto"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>

          {/* Name + level */}
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-sm px-2.5 py-1.5 rounded-[6px] border border-[#3B5CCC]/40 dark:border-[#4F6EF7]/40 bg-[#F5F6FA] dark:bg-[#0F172A]/50 text-[#1F2937] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B5CCC]/20 transition-all"
                style={{ fontWeight: 600 }}
              />
            ) : (
              <h2
                className="text-sm text-[#1F2937] dark:text-[#F9FAFB] truncate"
                style={{ fontWeight: 700 }}
              >
                {editName}
              </h2>
            )}

            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-xs text-[#6B7280] dark:text-[#94A3B8] truncate">
                {STUDENT.email}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB] dark:border-[#334155]" />

        {/* Info rows */}
        <div className="flex flex-col gap-2">
          <InfoRow
            icon={<FolderOpen className="w-3 h-3" />}
            label="Projeto atual"
            value={editProject}
          />
          <InfoRow
            icon={<GraduationCap className="w-3 h-3" />}
            label="Professor"
            value="Prof. Dr. João Silva"
          />
          <InfoRow
            icon={<Award className="w-3 h-3" />}
            label="Nível AGES"
            value="AGES III"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB] dark:border-[#334155]" />

        {/* Attendance control */}
        <div className="flex flex-col gap-1.5 px-[0px] py-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CalendarCheck className="w-3 h-3 text-[#6B7280] dark:text-[#94A3B8]" />
              <span className="text-[10px] text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wide">Frequência</span>
            </div>
            <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">
              <span className="text-[#F47B20]" style={{ fontWeight: 600 }}>2</span>
              <span> / 4 faltas</span>
            </span>
          </div>
          <div className="w-full h-1 rounded-full bg-[#E5E7EB] dark:bg-[#334155] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F47B20] transition-all duration-500"
              style={{ width: "50%" }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] text-[#9CA3AF] dark:text-[#64748B]">2 faltas usadas</span>
            <span className="text-[10px] text-[#9CA3AF] dark:text-[#64748B]">2 restantes</span>
          </div>
        </div>
      </div>
    </div>
  );
}