import { Folder, Users, Calendar, ExternalLink, GitBranch, Zap, CircleCheckBig, FolderOpen } from "lucide-react";
import { Button } from "@/app/components/ui/Button/Button";
import { useNavigate } from "react-router";

// Interfaces de Tipo
type ProjectStatus = "ATIVO" | "CONCLUIDO";

interface Project {
  id: number;
  name: string;
  semester: string;
  agesLevel: string;
  membersCount: number;
  description: string;
  status: ProjectStatus;
  tags: string[];
  repositoryUrl: string;
}

// 1. Dados Mockados conforme o Print
const mockProjects: Project[] = [
  {
    id: 1,
    name: "FluxoAGES",
    semester: "2026/1",
    agesLevel: "AGES IV",
    membersCount: 14,
    description: "Plataforma web de gestão acadêmica para estudantes universitários. Controle de horas, relatórios de sprint e acompanhamento de projetos em tempo real.",
    status: "ATIVO",
    tags: ["React", "TypeScript", "Tailwind"],
    repositoryUrl: "https://github.com",
  },
  {
    id: 2,
    name: "ClinAgenda",
    semester: "2025/2",
    agesLevel: "AGES III",
    membersCount: 10,
    description: "Sistema de agendamento online para clínicas e consultórios. Gestão de pacientes, agenda médica e notificações automáticas por e-mail e SMS.",
    status: "CONCLUIDO",
    tags: ["Vue.js", "Node.js", "PostgreSQL"],
    repositoryUrl: "https://github.com",
  },
  {
    id: 3,
    name: "EduTrack",
    semester: "2025/1",
    agesLevel: "AGES II",
    membersCount: 11,
    description: "Ferramenta de acompanhamento de aprendizagem para professores e alunos. Dashboard de desempenho, gamificação e relatórios pedagógicos.",
    status: "CONCLUIDO",
    tags: ["React", "Django", "MySQL"],
    repositoryUrl: "https://github.com",
  },
  {
    id: 4,
    name: "StockWise",
    semester: "2024/2",
    agesLevel: "AGES I",
    membersCount: 13,
    description: "Gerenciador de estoque inteligente para pequenas e médias empresas. Controle de produtos, alertas de reposição e integração com notas fiscais.",
    status: "CONCLUIDO",
    tags: ["Angular", "Spring Boot", "Oracle"],
    repositoryUrl: "https://github.com",
  },
];

export function ProjetosPage() {
  const activeCount = mockProjects.filter(p => p.status === "ATIVO").length;
  const completedCount = mockProjects.filter(p => p.status === "CONCLUIDO").length;

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* Header Superior de Visão Geral */}
      <div className="bg-white rounded-2xl border border-[#6B728030] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#3B5CCC15] text-[#3B5CCC] rounded-2xl">
            <FolderOpen size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">Mapa de Projetos</h2>
            <p className="text-sm text-[#6B7280]">Todos os projetos em que você participou</p>
          </div>
        </div>

        {/* Badges de Contagem global */}
        <div className="flex items-center gap-3">
          <span className="inline-flex leading-none items-center gap-1 bg-[#F47B2015] text-[#F47B20] border border-orange-100 px-3 py-2 rounded-xl text-sm font-semibold">
            <Zap fill="#F47B20" size={14}/>
             {activeCount} ativo
          </span>
          <span className="inline-flex items-center gap-1 bg-[#00A63E20] leading-none text-[#00A63E] border border-[#00A63E40] px-3 py-2 rounded-xl text-sm font-semibold">
            <CircleCheckBig size={14} />
            {completedCount} concluídos
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}


// Subcomponente de Card (Interno)
interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const isAtivo = project.status === "ATIVO";

  const handleDetailsClick = () => {
    navigate(`/projetos/${project.id}`);
  };

  return (
    <div 
      onClick={handleDetailsClick}
      className="bg-white rounded-2xl border border-[#6B728030] overflow-hidden shadow-sm flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {/*Barra superior colorida baseada no status */}
      <div className={`h-[4px] w-full bg-${isAtivo ? '[#F47B20]' : '[#3B5CCC]'}`}/>

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Header do Card */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${isAtivo ? 'bg-[#F47B2015] text-[#F47B20]' : 'bg-[#3B5CCC15] text-[#3B5CCC]'}`}>
              <FolderOpen size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">{project.name}</h3>
          </div>

          {/* Badge de Status */}
          <span className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center gap-1 leading-none ${
            isAtivo 
              ? 'bg-[#F47B2015] text-[#F47B20] border-[#F47B2040]' 
              : 'bg-[#00A63E20] text-[#00A63E] border-[#00A63E40]'
          }`}>
            {isAtivo ? 
            (
                <>
                <Zap fill="#F47B20" size={14}/>
                Em andamento
                </>

            )
            : (
                <>
                <CircleCheckBig size={14}/>
                Concluído
                </>
            )}
          </span>
        </div>

        {/* Metadados */}
        <div className="flex items-center gap-4 text-xs font-medium text-[#6B7280]">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {project.semester}
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {project.agesLevel} · {project.membersCount} membros
          </span>
        </div>

        {/* Descrição */}
        <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags de tecnologias */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.tags.map((tag) => (
            <span key={tag} className="inline px-2.5 py-1 bg-[#6B728010] border border-[#6B728030] text-[#6B7280] rounded-full text-xs font-semibold">
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
          className="flex items-center justify-center gap-1.5 font-bold"
        >
          <GitBranch size={16}/>
          Repositório
          <ExternalLink size={14} />
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleDetailsClick}
          className="!font-semibold border !border-[#6B728030] bg-transparent hover:bg-[#6B728010] !text-[#3B5CCC]"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
};