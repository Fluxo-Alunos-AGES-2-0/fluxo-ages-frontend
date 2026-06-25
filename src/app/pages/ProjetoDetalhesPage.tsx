import {
  Camera,
  CircleCheckBig,
  ExternalLink,
  FolderOpen,
  GitBranch,
  Loader2,
  Pencil,
  Users,
  X,
  Zap,
  ChevronRight,
  ChevronDown,
  Code2
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/app/components/ui/Button/Button";
import { useToast } from "@/app/context/ToastContext";
import { api, resolveFileUrl } from "../services/api";
import { toAgesLevel } from "../utils/agesLevel";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ProjectTeacher {
  id: number;
  name: string;
}

interface ProjectTeamMember {
  id: number;
  name: string;
  avatarUrl: string | null;
  agesLevel: number;
}

interface ProjectDetails {
  id: number;
  name: string;
  description: string | null;
  projectStatus: string;
  period: string | null;
  semesterYear: string | null;
  agesLevel: number | null;
  membersCount: number;
  gitLabLink: string | null;
  teacher: ProjectTeacher | null;
  team: ProjectTeamMember[];
  technologies: string[];
  thumbnailUrl: string | null;
  groupPhotoUrl: string | null;
}

interface ProjectUpdateResponse {
  id: number;
  summary: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  groupPhotoUrl: string | null;
}

type EditableImageType = "thumbnail" | "groupPhoto";

function revokeObjectUrl(url: string | null) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function toDisplayImageUrl(url: string | null) {
  if (!url) return "";
  return url.startsWith("blob:") ? url : resolveFileUrl(url);
}

export default function ProjetoDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const groupPhotoInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftDescription, setDraftDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [groupPhotoFile, setGroupPhotoFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null,
  );
  const [groupPhotoPreviewUrl, setGroupPhotoPreviewUrl] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get<ProjectDetails>(`/projects/${id}`)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Erro ao buscar detalhes do projeto:", err);
        setError("Não foi possível carregar os detalhes do projeto.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(thumbnailPreviewUrl);
      revokeObjectUrl(groupPhotoPreviewUrl);
    };
  }, [thumbnailPreviewUrl, groupPhotoPreviewUrl]);

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-6 font-sans">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#6B728030] dark:border-[#334155] p-6 shadow-sm text-center text-[#6B7280] dark:text-[#94A3B8] py-10">
          Carregando detalhes do projeto...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full flex flex-col gap-6 font-sans">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#6B728030] dark:border-[#334155] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-[#F4F6F7]">
            Projeto não encontrado
          </h2>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-1">
            {error ?? "O projeto solicitado não existe ou não está disponível."}
          </p>

          <Button
            variant="secondary"
            onClick={() => navigate("/projetos")}
            className="mt-5"
          >
            Voltar para projetos
          </Button>
        </div>
      </div>
    );
  }

  const isAtivo = project.projectStatus === "EM_ANDAMENTO";
  const canEditProject = isAtivo && project.agesLevel === 4;
  const bannerUrl = project.groupPhotoUrl ?? "";

  const agesLevels = [1, 2, 3, 4];

  const handleRepositoryClick = () => {
    if (!project.gitLabLink) return;
    window.open(project.gitLabLink, "_blank", "noopener,noreferrer");
  };

  const clearDraftImages = () => {
    revokeObjectUrl(thumbnailPreviewUrl);
    revokeObjectUrl(groupPhotoPreviewUrl);
    setThumbnailFile(null);
    setGroupPhotoFile(null);
    setThumbnailPreviewUrl(null);
    setGroupPhotoPreviewUrl(null);
  };

  const handleStartEditing = () => {
    setDraftDescription(project.description ?? "");
    clearDraftImages();
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    clearDraftImages();
    setDraftDescription(project.description ?? "");
    setIsEditing(false);
  };

  const validateImageFile = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showToast({
        variant: "error",
        title: "Formato inválido",
        message: "Envie uma imagem JPG, PNG ou WEBP.",
      });
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      showToast({
        variant: "error",
        title: "Arquivo muito grande",
        message: "A imagem deve ter no máximo 10MB.",
      });
      return false;
    }

    return true;
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: EditableImageType,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!validateImageFile(file)) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "thumbnail") {
      revokeObjectUrl(thumbnailPreviewUrl);
      setThumbnailFile(file);
      setThumbnailPreviewUrl(previewUrl);
      return;
    }

    revokeObjectUrl(groupPhotoPreviewUrl);
    setGroupPhotoFile(file);
    setGroupPhotoPreviewUrl(previewUrl);
  };

  const handleSaveChanges = async () => {
    if (!project || isSaving) return;

    const formData = new FormData();
    formData.append("description", draftDescription);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    if (groupPhotoFile) {
      formData.append("groupPhoto", groupPhotoFile);
    }

    setIsSaving(true);

    try {
      const updatedProject = await api.patch<ProjectUpdateResponse>(
        `/projects/${project.id}`,
        formData,
      );

      setProject((currentProject) => {
        if (!currentProject) return currentProject;

        return {
          ...currentProject,
          description: updatedProject.description,
          thumbnailUrl: updatedProject.thumbnailUrl,
          groupPhotoUrl: updatedProject.groupPhotoUrl,
        };
      });

      clearDraftImages();
      setIsEditing(false);

      showToast({
        variant: "success",
        title: "Projeto atualizado",
        message: "As alterações foram salvas com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao atualizar projeto:", err);

      showToast({
        variant: "error",
        title: "Erro ao salvar",
        message:
          err instanceof Error
            ? err.message
            : "Não foi possível salvar as alterações do projeto.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#6B728030] dark:border-[#334155] shadow-sm overflow-hidden relative">

        {/* Cabeçalho */}
        <div className="p-6 pb-4 flex items-center justify-between gap-4 border-b border-[#6B728030] dark:border-[#334155]">

          <div className="flex items-center gap-4">
            {/* Ícone/Thumbnail do Projeto (editável no modo de edição) */}
            {isEditing ? (
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                disabled={isSaving}
                className="group relative w-14 h-14 rounded-xl overflow-hidden border border-slate-100 dark:border-[#334155] shadow-sm shrink-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Alterar thumbnail"
                title="Alterar thumbnail"
              >
                {thumbnailPreviewUrl ?? project.thumbnailUrl ? (
                  <img
                    src={toDisplayImageUrl(thumbnailPreviewUrl ?? project.thumbnailUrl)}
                    alt={`Logo ${project.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-orange-50 text-[#F47B20] flex items-center justify-center">
                    <FolderOpen size={24} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
                  <Camera size={18} className="text-white" />
                </div>
              </button>
            ) : project.thumbnailUrl ? (
              <img
                src={toDisplayImageUrl(project.thumbnailUrl)}
                alt={`Logo ${project.name}`}
                className="w-14 h-14 rounded-xl border border-slate-100 object-contain p-1 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-orange-50 text-[#F47B20] flex items-center justify-center shadow-sm">
                <FolderOpen size={28} />
              </div>
            )}
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-[#F47B20] leading-none">
                  {project.name}
                </h2>
                {project.period && (
                  <span className="text-sm text-[#6B7280] font-medium border-l border-slate-300 pl-3">
                    {project.period}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center gap-1 leading-none ${
                isAtivo
                  ? "bg-[#F47B2015] text-[#F47B20] border-[#F47B2040]"
                  : "bg-[#00A63E20] text-[#00A63E] border-[#00A63E40]"
              }`}
            >
              {isAtivo ? (
                <>
                  <Zap fill="#F47B20" size={14} />
                  Em andamento
                </>
              ) : (
                <>
                  <CircleCheckBig size={14} />
                  Concluído
                </>
              )}
            </span>

            {canEditProject && !isEditing && (
              <button
                type="button"
                onClick={handleStartEditing}
                className="cursor-pointer rounded-full border border-[#F47B2040] p-2 text-[#F47B20] transition-colors hover:bg-[#F47B2015]"
                aria-label="Editar projeto"
                title="Editar projeto"
              >
                <Pencil size={18} />
              </button>
            )}

            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="accent-secondary"
                  disabled={isSaving}
                  onClick={handleCancelEditing}
                  className="px-4"
                >
                  Cancelar
                </Button>

                <Button
                  type="button"
                  variant="accent"
                  loading={isSaving}
                  onClick={handleSaveChanges}
                  className="px-4"
                >
                  Salvar
                </Button>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate("/projetos")}
              className="cursor-pointer text-[#94A3B8] hover:text-[#1F2937] dark:hover:text-[#F4F6F7] transition-colors"
              aria-label="Voltar para projetos"
            >
              <X size={30} />
            </button>
          </div>
        </div>

        {/* Corpo (Grid) */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Lado Esquerdo: Banner e Equipe */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {/* Banner = Foto do grupo (editável por hover no modo de edição) */}
            <div className="rounded-xl overflow-hidden border-b-4 border-[#F47B20] shadow-sm">
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => groupPhotoInputRef.current?.click()}
                  disabled={isSaving}
                  className="group relative block h-[280px] w-full overflow-hidden bg-[#EEF3FF] dark:bg-[#334155] cursor-pointer disabled:cursor-not-allowed"
                >
                  {groupPhotoPreviewUrl ?? project.groupPhotoUrl ? (
                    <img
                      src={toDisplayImageUrl(groupPhotoPreviewUrl ?? project.groupPhotoUrl)}
                      alt={`Foto do grupo do projeto ${project.name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#3B5CCC]">
                      <Users size={64} opacity={0.5} />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1F2937] shadow-md">
                      <Camera size={18} />
                      Alterar foto do grupo
                    </div>
                  </div>

                  {isSaving && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <Loader2 className="animate-spin text-[#F47B20]" size={34} />
                    </div>
                  )}
                </button>
              ) : bannerUrl ? (
                <img
                  src={toDisplayImageUrl(bannerUrl)}
                  alt={`Foto do grupo do projeto ${project.name}`}
                  className="w-full h-[280px] object-cover"
                />
              ) : (
                <div className="w-full h-[280px] bg-[#EEF3FF] dark:bg-[#334155] flex items-center justify-center text-[#3B5CCC]">
                  <Users size={64} opacity={0.5} />
                </div>
              )}
            </div>

            {/* Inputs de arquivo (thumbnail no cabeçalho, foto do grupo no banner) */}
            {isEditing && (
              <>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isSaving}
                  onChange={(event) => handleImageChange(event, "thumbnail")}
                />

                <input
                  ref={groupPhotoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isSaving}
                  onChange={(event) => handleImageChange(event, "groupPhoto")}
                />
              </>
            )}

            {/* Acordeão de Membros */}
            <div className="flex flex-col gap-4">
              {agesLevels.map((level) => {
                const levelMembers = project.team.filter(m => m.agesLevel === level);
                if (levelMembers.length === 0) return null;

                const isExpanded = expandedLevel === level;

                return (
                  <div key={level} className="flex flex-col gap-2">
                    <button
                      onClick={() => setExpandedLevel(isExpanded ? null : level)}
                      className="flex items-center gap-1.5 text-[#3B5CCC] dark:text-[#4E6CFF] font-bold hover:text-[#2f4fb8] transition-colors w-fit cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      {toAgesLevel(level)}
                    </button>
                    {isExpanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 animate-in fade-in slide-in-from-top-2 duration-200 mt-2 mb-2">
                        {levelMembers.map((member) => (
                          <div key={member.id} className="flex items-center gap-3">
                            {member.avatarUrl && !imageErrors[member.id] ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100"
                                onError={() => setImageErrors(prev => ({ ...prev, [member.id]: true }))}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#334155] border border-slate-200 dark:border-[#31405A] flex items-center justify-center text-slate-500 dark:text-[#94A3B8] font-bold text-sm shadow-sm">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-sm font-medium text-slate-700 dark:text-[#F4F6F7] break-words line-clamp-2">
                              {member.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lado Direito: Descrição e Tecnologias */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[#EEF3FF] dark:bg-[#1E293B] rounded-xl p-6 flex flex-col gap-6 shadow-sm">
              <div className="flex flex-col gap-5">
                {isEditing ? (
                  <div className="relative">
                    <textarea
                      value={draftDescription}
                      disabled={isSaving}
                      maxLength={1250}
                      onChange={(event) =>
                        setDraftDescription(event.target.value)
                      }
                      className="min-h-[220px] w-full resize-none rounded-2xl border border-[#3B5CCC30] bg-white dark:bg-[#1E293B] p-4 text-sm leading-relaxed text-[#1F2937] dark:text-[#F4F6F7] outline-none transition-colors focus:border-[#3B5CCC] focus:ring-1 focus:ring-[#3B5CCC] disabled:opacity-60"
                      placeholder="Descreva o projeto..."
                    />

                    <div className="mt-1 text-right text-[11px] font-medium text-slate-400 dark:text-[#94A3B8]">
                      {draftDescription.length} / 1250
                    </div>

                    {isSaving && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-[#1E293B]/70">
                        <Loader2
                          className="animate-spin text-[#F47B20]"
                          size={32}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[15px] text-[#6B7280] dark:text-[#94A3B8] leading-relaxed text-justify">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-col gap-3 text-sm text-[#6B7280] dark:text-[#94A3B8] mt-2">
                  <p className="flex items-center gap-2 border-t border-[#3B5CCC20] dark:border-[#31405A] pt-4">
                    <Users size={16} className="text-[#3B5CCC] dark:text-[#4E6CFF]" />
                    <span>
                      <span className="font-semibold text-slate-700 dark:text-[#F4F6F7]">Clientes AGES:</span>{" "}
                      {project.teacher?.name}
                    </span>
                  </p>

                  {project.teacher && (
                    <p className="flex items-center gap-2">
                      <Users size={16} className="text-[#3B5CCC] opacity-0" /> {/* Ícone invisível para alinhamento */}
                      <span>
                        <span className="font-semibold text-slate-700 dark:text-[#F4F6F7]">Orientador(a):</span>{" "}
                        {project.teacher.name}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleRepositoryClick}
                disabled={!project.gitLabLink}
                className="mt-4 !bg-[#3B5CCC] hover:!bg-[#2f4fb8] flex items-center justify-center gap-2 font-bold w-full"
              >
                <GitBranch size={16} />
                Repositório
                <ExternalLink size={14} />
              </Button>
            </div>

            {/* Bloco de Tecnologias */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-2 flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#1F2937] dark:text-[#F4F6F7]">
                  Tecnologias
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-5">
                  {project.technologies.map((tech) => (
                    <div key={tech} className="flex flex-col items-center justify-start w-16 gap-2">
                      <div className="w-11 h-11 rounded-xl bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#31405A] flex items-center justify-center text-[#94a3b8] dark:text-[#94A3B8] shadow-sm">
                        <Code2 size={20} />
                      </div>
                      <span className="text-[11px] text-center text-slate-600 dark:text-[#94A3B8] font-semibold leading-tight break-words w-full">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}