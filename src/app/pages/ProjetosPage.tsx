import {
    Users,
    Calendar,
    ExternalLink,
    GitBranch,
    Zap,
    CircleCheckBig,
    FolderOpen,
    Pencil,
    Camera,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/Button/Button";
import { TextArea } from "@/app/components/ui/TextArea/TextArea";
import { useNavigate } from "react-router";
import { useToast } from "@/app/context/ToastContext";
import { api } from "../services/api";
import { toAgesLevel } from "../utils/agesLevel";
import { OnboardingTooltip } from "../components/Onboarding/OnboardingTooltip";
import { usePageOnboarding } from "../components/Onboarding/usePageOnboarding";

const ALLOWED_THUMBNAIL_TYPES = ["image/webp", "image/png", "image/jpg"];
const MAX_THUMBNAIL_SIZE_BYTES = 10 * 1024 * 1024; //10MB

const PROJETOS_STEPS = [
    {
        target: "[data-onboarding='projetos-header']",
        title: "Mapa de Projetos",
        description:
            "Visualize todos os projetos em que você participou ao longo do curso.",
        placement: "bottom" as const,
    },
    {
        target: "[data-onboarding='projetos-status-badges']",
        title: "Status dos Projetos",
        description:
            "Os badges laranja indicam projetos ativos; os verdes mostram projetos concluídos. A cor da barra no topo de cada card reflete o status.",
        placement: "bottom" as const,
    },
    {
        target: "[data-onboarding='projetos-grid']",
        title: "Cards de Projeto",
        description:
            "Cada card exibe o nome, semestre, tecnologias utilizadas e membros da equipe. Clique em 'Ver detalhes' para acessar o cronograma e entregas do projeto.",
        placement: "top" as const,
    },
];

interface ProjectTechnology {
    id: number;
    name: string;
    iconUrl: string | null;
}

interface ProjectListItem {
    id: number;
    name: string;
    summary: string | null;
    projectStatus: string;
    studentStatus: string;
    period: string | null;
    semesterYear: string | null;
    agesLevel: number | null;
    gitLabLink: string | null;
    membersCount: number;
    technologies: ProjectTechnology[];
    thumbnailUrl: string | null;
    groupPhotoUrl: string | null;
}

export function ProjetosPage() {
    const [projects, setProjects] = useState<ProjectListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        api
            .get<ProjectListItem[]>("/projects")
            .then((data) => {
                if (!cancelled) setProjects(data ?? []);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Erro ao buscar projetos:", err);
                setError("Não foi possível carregar os projetos.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    usePageOnboarding("projetos", PROJETOS_STEPS);

    const handleProjectUpdated = (
        id: number,
        updated: Partial<ProjectListItem>,
    ) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        );
    };

    const activeCount = projects.filter(
        (p) => p.projectStatus === "EM_ANDAMENTO",
    ).length;
    const completedCount = projects.filter(
        (p) => p.projectStatus === "CONCLUIDO",
    ).length;

    return (
        <>
            <OnboardingTooltip steps={PROJETOS_STEPS} />

            <div className="w-full flex flex-col gap-6 font-sans">
                {/* Header Superior de Visão Geral */}
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#6B728030] dark:border-[#334155] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm" data-onboarding="projetos-header">
                    <div className="flex items-center gap-3" data-onboarding="projetos-status-badges">
                        <div className="p-3 bg-[#3B5CCC15] dark:bg-[#334155] text-[#3B5CCC] dark:text-[#94A3B8] rounded-2xl">
                            <FolderOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1F2937] dark:text-[#F4F6F7]">
                                Mapa de Projetos
                            </h2>
                            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
                                Todos os projetos em que você participou
                            </p>
                        </div>
                    </div>

                    {/* Badges de Contagem global */}
                    <div className="flex items-center gap-3">
                        <span className="inline-flex leading-none items-center gap-1 bg-[#F47B2015] text-[#F47B20] border border-orange-100 px-3 py-2 rounded-xl text-sm font-semibold">
                            <Zap fill="#F47B20" size={14} />
                            {activeCount} ativo
                        </span>
                        <span className="inline-flex items-center gap-1 bg-[#00A63E20] leading-none text-[#00A63E] border border-[#00A63E40] px-3 py-2 rounded-xl text-sm font-semibold">
                            <CircleCheckBig size={14} />
                            {completedCount} concluídos
                        </span>
                    </div>
                </div>

                {loading && (
                    <div className="text-center text-[#6B7280] dark:text-[#94A3B8] py-10">
                        Carregando projetos...
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center text-red-600 dark:text-red-400 py-10">{error}</div>
                )}

                {!loading && !error && projects.length === 0 && (
                    <div className="text-center text-[#6B7280] dark:text-[#94A3B8] py-10">
                        Nenhum projeto encontrado.
                    </div>
                )}

                {!loading && !error && projects.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 items-start" data-onboarding="projetos-grid">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onProjectUpdated={handleProjectUpdated}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

// Subcomponente de Card (Interno)
interface ProjectCardProps {
    project: ProjectListItem;
    onProjectUpdated: (id: number, updated: Partial<ProjectListItem>) => void;
}

const ProjectCard = ({ project, onProjectUpdated }: ProjectCardProps) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const isAtivo = project.projectStatus === "EM_ANDAMENTO";
    const isAgesIV = project.agesLevel === 4;
    const canEdit = isAtivo && isAgesIV;

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [summaryDraft, setSummaryDraft] = useState(project.summary ?? "");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<
        string | null
    >(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
        };
    }, [thumbnailPreviewUrl]);

    const displayThumbnailUrl = thumbnailPreviewUrl ?? project.thumbnailUrl;

    const resetEditState = () => {
        setSummaryDraft(project.summary ?? "");
        if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
        setThumbnailFile(null);
        setThumbnailPreviewUrl(null);
    };

    const handleDetailsClick = () => {
        if (isEditing) return;
        navigate(`/projetos/${project.id}`);
    };

    const handleRepositoryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!project.gitLabLink) return;
        window.open(project.gitLabLink, "_blank", "noopener,noreferrer");
    };

    const handleStartEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        resetEditState();
        setIsEditing(true);
    };

    const handleCancelEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        resetEditState();
        setIsEditing(false);
    };

    const handleThumbnailClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEditing) return;
        fileInputRef.current?.click();
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = "";

        if (!file) return;

        if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type)) {
            showToast({
                variant: "error",
                title: "Formato inválido",
                message: "Envie uma imagem JPG, PNG ou WEBP.",
            });
            return;
        }

        if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
            showToast({
                variant: "error",
                title: "Arquivo muito grande",
                message: "O limite é 10MB.",
            });
            return;
        }

        if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
        setThumbnailFile(file);
        setThumbnailPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaving(true);

        try {
            const formData = new FormData();
            if (summaryDraft !== (project.summary ?? "")) {
                formData.append("summary", summaryDraft);
            }
            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }

            const updated = await api.patch(`/projects/${project.id}`, formData);

            onProjectUpdated(project.id, {
                summary: summaryDraft,
                ...updated,
            });
            showToast({
                variant: "success",
                title: "Card do projeto atualizado com sucesso!",
            });
            if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
            setThumbnailFile(null);
            setThumbnailPreviewUrl(null);
            setIsEditing(false);
        } catch (err) {
            console.error("Erro ao atualizar projeto:", err);
            showToast({
                variant: "error",
                title: "Erro ao salvar",
                message: "Não foi possível salvar as alterações. Tente novamente.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            onClick={handleDetailsClick}
            className={`bg-white dark:bg-[#1E293B] rounded-2xl border border-[#6B728030] dark:border-[#334155] overflow-hidden shadow-sm flex flex-col justify-between h-fit relative transition-shadow ${isEditing ? "" : "cursor-pointer hover:shadow-md dark:hover:border-[#3B5CCC]"
                }`}
        >
            {/*Barra superior colorida baseada no status */}
            <div
                className={`h-[4px] w-full ${isAtivo ? "bg-[#F47B20]" : "bg-[#3B5CCC]"}`}
            />

            <div className="p-6 flex flex-col gap-4 flex-1">
                {/* Header do Card */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div
                            onClick={handleThumbnailClick}
                            className={`relative p-2 rounded-lg overflow-hidden w-9 h-9 flex items-center justify-center group ${isAtivo ? "bg-[#F47B2015] text-[#F47B20]" : "bg-[#3B5CCC15] text-[#3B5CCC]"
                                } ${isEditing ? "cursor-pointer" : ""}`}
                        >
                            {displayThumbnailUrl ? (
                                <img
                                    src={displayThumbnailUrl}
                                    alt={project.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <FolderOpen size={20} />
                            )}

                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                    <Camera size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-[#1F2937] dark:text-[#F4F6F7]">{project.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Badge de Status */}
                        {canEdit && !isEditing && (
                            <button
                                type="button"
                                variant="primary"
                                onClick={handleStartEdit}
                                aria-label="Editar projeto"
                                className="p-2 rounded-lg text-[#3b5ccc] border border-[#6B728030] hover:bg-[#6B728010] hover:text-[#294294] cursor-pointer transition-colors"
                            >
                                <Pencil size={16} />
                            </button>
                        )}
                        {isEditing && (
                          <div className="flex items-center gap-2">
                                <Button
                                    variant="accent-secondary"
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="!px-3 !py-1.5 !text-xs"
                                    >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="accent"
                                    onClick={handleSave}
                                    loading={isSaving}
                                    className="!px-3 !py-1.5 !text-xs"
                                    >
                                    Salvar
                                </Button>
                            </div>
                        )}
                        <span
                            className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center gap-1 leading-none ${isAtivo
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
                    </div>
                </div>

                {/* Input de arquivo escondido, usado pelo overlay da thumbnail */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/webp,image/png,image/jpg"
                    className="hidden"
                    onChange={handleThumbnailChange}
                />

                {/* Metadados */}
                <div className="flex items-center gap-4 text-xs font-medium text-[#6B7280] dark:text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {project.semesterYear ?? "—"}
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                        <Users size={14} />
                        {toAgesLevel(project.agesLevel ?? undefined)} ·{" "}
                        {project.membersCount} membros
                    </span>
                </div>

                {/* Descrição */}
                {isEditing ? (
                    <div onClick={(e) => e.stopPropagation()}>
                        <TextArea
                            label="Resumo do projeto"
                            value={summaryDraft}
                            onChange={(value) => setSummaryDraft(value)}
                            maxLength={300}
                            rows={3}
                            placeholder="Descreva o projeto..."
                        />
                    </div>
                ) : (
                    <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                        {project.summary}
                    </p>
                )}

                {/* Tags de tecnologias */}
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {project.technologies.map((tech) => (
                        <span
                            key={tech.id} // <-- Use o id como key única
                            className="inline px-2.5 py-1 bg-[#6B728010] dark:bg-[#334155] border border-[#6B728030] dark:border-[#334155] text-[#6B7280] dark:text-[#94A3B8] rounded-full text-xs font-semibold"
                        >
                            {tech.name} {/* <-- Renderize apenas a string do nome */}
                        </span>
                    ))}
                </div>

                {/* Divisor */}
                <div className="border-t border-[#6B728030] dark:border-[#334155] mx-6" />

                {/* Botões de Ação */}
                <div className="p-6 pt-4 grid grid-cols-2 gap-3 ">
                    <Button
                        variant="primary"
                        onClick={handleRepositoryClick}
                        disabled={!project.gitLabLink}
                        className="flex items-center justify-center gap-1.5 font-bold"
                    >
                        <GitBranch size={16} />
                        Repositório
                        <ExternalLink size={14} />
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDetailsClick();
                        }}
                        className="!font-semibold border !border-[#6B728030] dark:!border-[#334155] bg-transparent hover:bg-[#6B728010] dark:hover:bg-[#334155] !text-[#3B5CCC]"
                    >
                        Ver detalhes
                    </Button>
                </div>
            </div>
        </div>
    );
};
