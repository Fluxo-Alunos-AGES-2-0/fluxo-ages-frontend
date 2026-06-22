import {
  Users,
  Calendar,
  ExternalLink,
  GitBranch,
  Zap,
  CircleCheckBig,
  FolderOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button/Button";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import { toAgesLevel } from "../utils/agesLevel";
import { OnboardingTooltip } from "../components/Onboarding/OnboardingTooltip";
import { usePageOnboarding } from "../components/Onboarding/usePageOnboarding";

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
  technologies: string[];
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
      <div className="bg-white rounded-2xl border border-[#6B728030] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm" data-onboarding="projetos-header">
        <div className="flex items-center gap-3" data-onboarding="projetos-status-badges">
          <div className="p-3 bg-[#3B5CCC15] text-[#3B5CCC] rounded-2xl">
            <FolderOpen size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">
              Mapa de Projetos
            </h2>
            <p className="text-sm text-[#6B7280]">
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
        <div className="text-center text-[#6B7280] py-10">
          Carregando projetos...
        </div>
      )}

      {!loading && error && (
        <div className="text-center text-red-600 py-10">{error}</div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center text-[#6B7280] py-10">
          Nenhum projeto encontrado.
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10" data-onboarding="projetos-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const isAtivo = project.projectStatus === "EM_ANDAMENTO";

  const handleDetailsClick = () => {
    navigate(`/projetos/${project.id}`);
  };

  const handleRepositoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project.gitLabLink) return;
    window.open(project.gitLabLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleDetailsClick}
      className="bg-white rounded-2xl border border-[#6B728030] overflow-hidden shadow-sm flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow relative"
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
              className={`p-2 rounded-lg ${isAtivo ? "bg-[#F47B2015] text-[#F47B20]" : "bg-[#3B5CCC15] text-[#3B5CCC]"}`}
            >
              <FolderOpen size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">{project.name}</h3>
          </div>

          {/* Badge de Status */}
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
        </div>

        {/* Metadados */}
        <div className="flex items-center gap-4 text-xs font-medium text-[#6B7280]">
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
        <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
          {project.summary}
        </p>

        {/* Tags de tecnologias */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.technologies.map((tag) => (
            <span
              key={tag}
              className="inline px-2.5 py-1 bg-[#6B728010] border border-[#6B728030] text-[#6B7280] rounded-full text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-[#6B728030] mx-6" />

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
          className="!font-semibold border !border-[#6B728030] bg-transparent hover:bg-[#6B728010] !text-[#3B5CCC]"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
};