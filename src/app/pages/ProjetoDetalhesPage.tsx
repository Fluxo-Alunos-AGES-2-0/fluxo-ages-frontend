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
        <div className="bg-white rounded-2xl border border-[#6B728030] p-6 shadow-sm text-center text-[#6B7280] py-10">
          Carregando detalhes do projeto...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full flex flex-col gap-6 font-sans">
        <div className="bg-white rounded-2xl border border-[#6B728030] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1F2937]">
            Projeto não encontrado
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">
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
  const imageUrl = project.thumbnailUrl ?? project.groupPhotoUrl ?? "";

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

  const renderEditableImage = (
    label: string,
    currentUrl: string | null,
    previewUrl: string | null,
    onClick: () => void,
  ) => {
    const displayUrl = previewUrl ?? currentUrl;

    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
          {label}
        </span>

        <button
          type="button"
          onClick={onClick}
          disabled={isSaving}
          className="group relative h-[220px] w-full overflow-hidden rounded-xl border-b-4 border-[#F47B20] bg-[#EEF3FF] cursor-pointer disabled:cursor-not-allowed"
        >
          {displayUrl ? (
            <img
              src={toDisplayImageUrl(displayUrl)}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[#3B5CCC]">
              <FolderOpen size={42} />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1F2937] shadow-md">
              <Camera size={18} />
              Alterar imagem
            </div>
          </div>

          {isSaving && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="animate-spin text-[#F47B20]" size={34} />
            </div>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="bg-white rounded-2xl border border-[#6B728030] shadow-sm overflow-hidden">
        <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-[#6B728030]">
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-bold text-[#F47B20]">
              {project.name}
            </h2>

            {project.period && (
              <span className="text-sm text-[#6B7280] mb-[2px]">
                {project.period}
              </span>
            )}
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
              className="cursor-pointer text-[#94A3B8] hover:text-[#1F2937] transition-colors"
              aria-label="Voltar para projetos"
            >
              <X size={30} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableImage(
                  "Thumbnail",
                  project.thumbnailUrl,
                  thumbnailPreviewUrl,
                  () => thumbnailInputRef.current?.click(),
                )}

                {renderEditableImage(
                  "Foto do grupo",
                  project.groupPhotoUrl,
                  groupPhotoPreviewUrl,
                  () => groupPhotoInputRef.current?.click(),
                )}

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
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border-b-4 border-[#F47B20]">
                {imageUrl ? (
                  <img
                    src={toDisplayImageUrl(imageUrl)}
                    alt={`Imagem do projeto ${project.name}`}
                    className="w-full h-[260px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[260px] bg-[#EEF3FF] flex items-center justify-center text-[#3B5CCC]">
                    <FolderOpen size={48} />
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#1F2937]">
                <Users size={16} className="text-[#3B5CCC]" />
                Equipe
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.team.length > 0 ? (
                  project.team.map((member) => (
                    <span
                      key={member.id}
                      className="px-3 py-1.5 rounded-full bg-[#6B728010] border border-[#6B728030] text-xs font-semibold text-[#6B7280]"
                    >
                      {member.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#6B7280]">
                    Nenhum membro cadastrado.
                  </span>
                )}
              </div>

              {project.technologies.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[#1F2937]">
                    Tecnologias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-full bg-[#3B5CCC10] border border-[#3B5CCC30] text-xs font-semibold text-[#3B5CCC]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#EEF3FF] rounded-xl p-6 min-h-[390px] flex flex-col justify-between">
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
                      className="min-h-[220px] w-full resize-none rounded-2xl border border-[#3B5CCC30] bg-white p-4 text-sm leading-relaxed text-[#1F2937] outline-none transition-colors focus:border-[#3B5CCC] focus:ring-1 focus:ring-[#3B5CCC] disabled:opacity-60"
                      placeholder="Descreva o projeto..."
                    />

                    <div className="mt-1 text-right text-[11px] font-medium text-slate-400">
                      {draftDescription.length} / 1250
                    </div>

                    {isSaving && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
                        <Loader2
                          className="animate-spin text-[#F47B20]"
                          size={32}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-col gap-3 text-sm text-[#6B7280]">
                  {project.teacher && (
                    <p>
                      <span className="font-semibold text-[#6B7280]">
                        Orientador(a):
                      </span>{" "}
                      {project.teacher.name}
                    </p>
                  )}

                  <p className="flex items-center gap-1">
                    <Users size={15} />
                    <span>
                      {toAgesLevel(project.agesLevel ?? undefined)} ·{" "}
                      {project.membersCount} membros
                      {project.semesterYear ? ` · ${project.semesterYear}` : ""}
                    </span>
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleRepositoryClick}
                disabled={!project.gitLabLink}
                className="self-center mt-8 px-10 !bg-[#3B5CCC] hover:!bg-[#2f4fb8] flex items-center gap-2 font-bold"
              >
                <GitBranch size={16} />
                Repositório
                <ExternalLink size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
