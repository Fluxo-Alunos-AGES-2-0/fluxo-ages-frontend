import {
  CircleCheckBig,
  ExternalLink,
  FolderOpen,
  GitBranch,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/app/components/ui/Button/Button";
import { api } from "../services/api";
import { toAgesLevel } from "../utils/agesLevel";

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

export default function ProjetoDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const imageUrl = project.thumbnailUrl ?? project.groupPhotoUrl ?? "";

  const handleRepositoryClick = () => {
    if (!project.gitLabLink) return;
    window.open(project.gitLabLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#6B728030] dark:border-[#334155] shadow-sm overflow-hidden">
        <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-[#6B728030] dark:border-[#334155]">
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-bold text-[#F47B20]">
              {project.name}
            </h2>

            {project.period && (
              <span className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-[2px]">
                {project.period}
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="rounded-xl overflow-hidden border-b-4 border-[#F47B20]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`Imagem do projeto ${project.name}`}
                  className="w-full h-[260px] object-cover"
                />
              ) : (
                <div className="w-full h-[260px] bg-[#F9FAFB] dark:bg-[#334155] flex items-center justify-center text-[#3B5CCC]">
                  <FolderOpen size={48} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#1F2937] dark:text-[#F4F6F7]">
                <Users size={16} className="text-[#3B5CCC]" />
                Equipe
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.team.length > 0 ? (
                  project.team.map((member) => (
                    <span
                      key={member.id}
                      className="px-3 py-1.5 rounded-full bg-[#6B728010] dark:bg-[#334155] border border-[#6B728030] dark:border-[#334155] text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]"
                    >
                      {member.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                    Nenhum membro cadastrado.
                  </span>
                )}
              </div>

              {project.technologies.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[#1F2937] dark:text-[#F4F6F7]">
                    Tecnologias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-full bg-[#3B5CCC10] dark:bg-[#334155] border border-[#3B5CCC30] dark:border-[#334155] text-xs font-semibold text-[#3B5CCC] dark:text-[#94A3B8]"
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
            <div className="bg-[#EEF3FF] dark:bg-[#1E293B] rounded-xl p-6 min-h-[390px] flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-col gap-3 text-sm text-[#6B7280] dark:text-[#94A3B8]">
                  {project.teacher && (
                    <p>
                      <span className="font-semibold text-[#6B7280] dark:text-[#94A3B8]">
                        Orientador(a):
                      </span>{" "}
                      {project.teacher.name}
                    </p>
                  )}

                  <p className="flex items-center gap-1">
                    <Users size={15} />
                    <span className="text-[#6B7280] dark:text-[#94A3B8]">
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
