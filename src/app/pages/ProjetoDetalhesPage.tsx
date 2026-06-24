import {
  CircleCheckBig,
  ExternalLink,
  FolderOpen,
  GitBranch,
  Users,
  X,
  Zap,
  ChevronRight,
  ChevronDown,
  Code2
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
  agesLevel: number;
}

interface ProjectTechnology {
  name: string;
  iconUrl: string | null;
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
  technologies: ProjectTechnology[];
  thumbnailUrl: string | null;
  groupPhotoUrl: string | null;
}

export default function ProjetoDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

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
  const bannerUrl = project.groupPhotoUrl ?? project.thumbnailUrl ?? "";
  
  const agesLevels = [1, 2, 3, 4];

  const handleRepositoryClick = () => {
    if (!project.gitLabLink) return;
    window.open(project.gitLabLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="bg-white rounded-2xl border border-[#6B728030] shadow-sm overflow-hidden relative">
        
        {/* Cabeçalho */}
        <div className="p-6 pb-4 flex items-center justify-between gap-4 border-b border-[#6B728030]">
          
          <div className="flex items-center gap-4">
            {/* Ícone/Thumbnail do Projeto */}
            {project.thumbnailUrl ? (
              <img 
                src={project.thumbnailUrl} 
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
              className="cursor-pointer text-[#94A3B8] hover:text-[#1F2937] transition-colors"
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
            <div className="rounded-xl overflow-hidden border-b-4 border-[#F47B20] shadow-sm">
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt={`Equipe do projeto ${project.name}`}
                  className="w-full h-[280px] object-cover" // Reduzido de 320px para 280px
                />
              ) : (
                <div className="w-full h-[280px] bg-[#EEF3FF] flex items-center justify-center text-[#3B5CCC]">
                  <Users size={64} opacity={0.5} />
                </div>
              )}
            </div>

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
                      className="flex items-center gap-1.5 text-[#3B5CCC] font-bold hover:text-[#2f4fb8] transition-colors w-fit cursor-pointer"
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
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm shadow-sm">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-sm font-medium text-slate-700 break-words line-clamp-2">
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
            <div className="bg-[#EEF3FF] rounded-xl p-6 flex flex-col gap-6 shadow-sm">
              <div className="flex flex-col gap-5">
                <p className="text-[15px] text-[#6B7280] leading-relaxed text-justify">
                  {project.description}
                </p>

                <div className="flex flex-col gap-3 text-sm text-[#6B7280] mt-2">
                  <p className="flex items-center gap-2 border-t border-[#3B5CCC20] pt-4">
                    <Users size={16} className="text-[#3B5CCC]" />
                    <span>
                      <span className="font-semibold text-slate-700">Clientes AGES:</span>{" "}
                      {project.teacher?.name}
                    </span>
                  </p>

                  {project.teacher && (
                    <p className="flex items-center gap-2">
                      <Users size={16} className="text-[#3B5CCC] opacity-0" /> {/* Ícone invisível para alinhamento */}
                      <span>
                        <span className="font-semibold text-slate-700">Orientador(a):</span>{" "}
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
                <h3 className="text-[16px] font-bold text-[#1F2937]">
                  Tecnologias
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-5">
                  {project.technologies.map((tech) => (
                    <div key={tech.name} className="flex flex-col items-center justify-start w-16 gap-2">
                      {tech.iconUrl ? (
                        <img 
                          src={tech.iconUrl} 
                          alt={`Ícone ${tech.name}`} 
                          className="w-11 h-11 object-contain drop-shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] shadow-sm">
                          <Code2 size={20} />
                        </div>
                      )}
                      <span className="text-[11px] text-center text-slate-600 font-semibold leading-tight break-words w-full">
                        {tech.name}
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