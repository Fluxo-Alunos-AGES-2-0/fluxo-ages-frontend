import { Folder, Users, Calendar, ExternalLink, GitBranch, Zap, Check } from "lucide-react";
import { Button } from "@/app/components/ui/Button/Button";

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
    agesLevel: "AGES III",
    membersCount: 8,
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
    membersCount: 7,
    description: "Sistema de agendamento online para clínicas e consultórios. Gestão de pacientes, agenda médica e notificações automáticas por e-mail e SMS.",
    status: "CONCLUIDO",
    tags: ["Vue.js", "Node.js", "PostgreSQL"],
    repositoryUrl: "https://github.com",
  },
  {
    id: 3,
    name: "EduTrack",
    semester: "2025/2",
    agesLevel: "AGES II",
    membersCount: 6,
    description: "Ferramenta de acompanhamento de aprendizagem para professores e alunos. Dashboard de desempenho, gamificação e relatórios pedagógicos.",
    status: "CONCLUIDO",
    tags: ["React", "Django", "MySQL"],
    repositoryUrl: "https://github.com",
  },
  {
    id: 4,
    name: "StockWise",
    semester: "2025/1",
    agesLevel: "AGES II",
    membersCount: 8,
    description: "Gerenciador de estoque inteligente para pequenas e médias empresas. Controle de produtos, alertas de reposição e integração com notas fiscais.",
    status: "CONCLUIDO",
    tags: ["Angular", "Spring Boot", "Oracle"],
    repositoryUrl: "https://github.com",
  },
];

// 3. Componente Principal da Tela
export function ProjetosPage() {
  const activeCount = mockProjects.filter(p => p.status === "ATIVO").length;
  const completedCount = mockProjects.filter(p => p.status === "CONCLUIDO").length;

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* Card Superior de Visão Geral (Header interno) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-[#3B5CCC] rounded-2xl">
            <Folder size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Mapa de Projetos</h2>
            <p className="text-sm text-slate-400">Todos os projetos em que você participou</p>
          </div>
        </div>

        {/* Badges de Contagem global */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 bg-orange-50 text-[#F47B20] border border-orange-100 px-3 py-1.5 rounded-xl text-sm font-semibold">
            ⚡ {activeCount} ativo
          </span>
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 border border-green-100 px-3 py-1.5 rounded-xl text-sm font-semibold">
            ✓ {completedCount} concluídos
          </span>
        </div>
      </div>

      {/* Requisito: Grid com 2 colunas em desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}


// 2. Subcomponente de Card (Interno)
interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const isAtivo = project.status === "ATIVO";

  // Redirecionamento fake para a US029 externa ao card
  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/projects/${project.id}`;
  };

  return (
    <div 
      onClick={() => window.location.href = `/projects/${project.id}`}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {/*Barra superior colorida baseada no status */}
      <div 

        className={`h-[4px] w-full bg-${isAtivo ? '[#F47B20]' : '[#3B5CCC]'}`}
      />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Header do Card */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${isAtivo ? 'bg-orange-50 text-[#F47B20]' : 'bg-blue-50 text-[#3B5CCC]'}`}>
              <Folder size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
          </div>

          {/* Badge de Status */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
            isAtivo 
              ? 'bg-orange-50 text-[#F47B20] border-orange-100' 
              : 'bg-green-50 text-green-600 border-green-100'
          }`}>
            {isAtivo ? 
            (
                <>
                <Zap fill="#F47B20" size={8}/>
                Em andamento
                </>

            )
            : (
                <>
                <Check size={14}/>
                Concluído
                </>
            )}
          </span>
        </div>

        {/* Metadados */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
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
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-slate-100 mx-6" />

      {/* Botões de Ação */}
      <div className="p-6 pt-4 grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          className="flex items-center justify-center gap-1.5 font-bold bg-[#3B5CCC]"
        >
            <GitBranch size={16}/>
        Repositório
          <ExternalLink size={13} />
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleDetailsClick}
          className="font-bold border border-slate-200 text-slate-600 bg-transparent hover:bg-slate-50"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
};