import { useState } from "react";
import {
  FolderOpen,
  GitBranch,
  ExternalLink,
  CheckCircle,
  Zap,
  ChevronDown,
  Calendar,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProjectStatus = "em_andamento" | "concluido";

interface Project {
  id: string;
  title: string;
  semester: string;
  semesterKey: string;
  description: string;
  team: string;
  members: number;
  status: ProjectStatus;
  gitlabUrl: string;
  tech: string[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "FluxoAGES",
    semester: "2026/1",
    semesterKey: "2026/1",
    description:
      "Plataforma web de gestão acadêmica para estudantes universitários. Controle de horas, relatórios de sprint e acompanhamento de projetos em tempo real.",
    team: "AGES III",
    members: 8,
    status: "em_andamento",
    gitlabUrl: "https://gitlab.com",
    tech: ["React", "TypeScript", "Tailwind"],
  },
  {
    id: "p2",
    title: "ClinAgenda",
    semester: "2025/2",
    semesterKey: "2025/2",
    description:
      "Sistema de agendamento online para clínicas e consultórios. Gestão de pacientes, agenda médica e notificações automáticas por e-mail e SMS.",
    team: "AGES III",
    members: 7,
    status: "concluido",
    gitlabUrl: "https://gitlab.com",
    tech: ["Vue.js", "Node.js", "PostgreSQL"],
  },
  {
    id: "p3",
    title: "EduTrack",
    semester: "2025/2",
    semesterKey: "2025/2",
    description:
      "Ferramenta de acompanhamento de aprendizagem para professores e alunos. Dashboard de desempenho, gamificação e relatórios pedagógicos.",
    team: "AGES II",
    members: 6,
    status: "concluido",
    gitlabUrl: "https://gitlab.com",
    tech: ["React", "Django", "MySQL"],
  },
  {
    id: "p4",
    title: "StockWise",
    semester: "2025/1",
    semesterKey: "2025/1",
    description:
      "Gerenciador de estoque inteligente para pequenas e médias empresas. Controle de produtos, alertas de reposição e integração com notas fiscais.",
    team: "AGES II",
    members: 8,
    status: "concluido",
    gitlabUrl: "https://gitlab.com",
    tech: ["Angular", "Spring Boot", "Oracle"],
  },
  {
    id: "p5",
    title: "SafeMap",
    semester: "2025/1",
    semesterKey: "2025/1",
    description:
      "Aplicativo de mapeamento de ocorrências urbanas com geolocalização. Reportes em tempo real, heatmaps de segurança e integração com órgãos públicos.",
    team: "AGES I",
    members: 5,
    status: "concluido",
    gitlabUrl: "https://gitlab.com",
    tech: ["React Native", "Firebase", "Maps API"],
  },
];

const SEMESTERS = ["Todos", "2026/1", "2025/2", "2025/1"];

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; icon: React.ReactNode; cls: string; dotCls: string }
> = {
  em_andamento: {
    label: "Em andamento",
    icon: <Zap className="w-3 h-3" fill="currentColor" />,
    cls: "bg-[#FFF5EC] dark:bg-[#F47B20]/10 text-[#F47B20] border border-[#F47B20]/25",
    dotCls: "bg-[#F47B20]",
  },
  concluido: {
    label: "Concluído",
    icon: <CheckCircle className="w-3 h-3" />,
    cls: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/40",
    dotCls: "bg-green-500",
  },
};

// ─── Tech pill ────────────────────────────────────────────────────────────────
function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F5F6FA] dark:bg-[#334155]/60 border border-[#E5E7EB] dark:border-[#334155] text-[10px] text-[#6B7280] dark:text-[#94A3B8]" style={{ fontWeight: 600 }}>
      {label}
    </span>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_CONFIG[project.status];

  return (
    <div
      className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Color accent bar — blue for active, green for done */}
      <div
        className={`h-0.5 w-full ${
          project.status === "em_andamento"
            ? "bg-gradient-to-r from-[#F47B20] to-[#f5a05a]"
            : "bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]"
        }`}
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Header row: title + status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 ${
                project.status === "em_andamento"
                  ? "bg-[#FFF5EC] dark:bg-[#F47B20]/10"
                  : "bg-[#EEF2FF] dark:bg-[#3B5CCC]/15"
              }`}
            >
              <FolderOpen
                className={`w-4 h-4 ${
                  project.status === "em_andamento"
                    ? "text-[#F47B20]"
                    : "text-[#3B5CCC] dark:text-[#4F6EF7]"
                }`}
              />
            </div>
            <h3
              className="text-sm text-[#1F2937] dark:text-[#F9FAFB] truncate"
              style={{ fontWeight: 700 }}
            >
              {project.title}
            </h3>
          </div>

          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] flex-shrink-0 ${status.cls}`}
            style={{ fontWeight: 600 }}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        {/* Meta: semester + team */}
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#94A3B8]">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            {project.semester}
          </span>
          <span className="w-px h-3 bg-[#E5E7EB] dark:bg-[#334155]" />
          <span className="flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#94A3B8]">
            <Users className="w-3 h-3 flex-shrink-0" />
            {project.team} · {project.members} membros
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>

        {/* Footer: GitLab + details buttons */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#334155] flex gap-2">
          <a
            href={project.gitlabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B5CCC] hover:opacity-90 text-white rounded-[8px] text-xs transition-opacity cursor-pointer flex-1 justify-center"
            style={{ fontWeight: 600 }}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Repositório
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] text-[#3B5CCC] dark:text-[#4F6EF7] hover:bg-[#EEF2FF] dark:hover:bg-[#3B5CCC]/10 rounded-[8px] text-xs transition-colors cursor-pointer flex-1 justify-center"
            style={{ fontWeight: 600 }}
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ semester }: { semester: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-full bg-[#F5F6FA] dark:bg-[#334155]/60 flex items-center justify-center">
        <FolderOpen className="w-5 h-5 text-[#9CA3AF] dark:text-[#64748B]" />
      </div>
      <p className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 600 }}>
        Nenhum projeto encontrado
      </p>
      <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
        Sem projetos em <span style={{ fontWeight: 600 }}>{semester}</span>
      </p>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ProjetosContent() {
  const [semester, setSemester] = useState("Todos");

  const filtered =
    semester === "Todos"
      ? PROJECTS
      : PROJECTS.filter((p) => p.semesterKey === semester);

  const activeCount = PROJECTS.filter((p) => p.status === "em_andamento").length;
  const doneCount   = PROJECTS.filter((p) => p.status === "concluido").length;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden transition-colors duration-300"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]" />
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: title + subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#EEF2FF] dark:bg-[#3B5CCC]/20 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-4 h-4 text-[#3B5CCC] dark:text-[#4F6EF7]" />
            </div>
            <div>
              <h2 className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 700 }}>
                Mapa de Projetos
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
                Todos os projetos em que você participou
              </p>
            </div>
          </div>

          {/* Right: stats + filter */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick stats */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-[#FFF5EC] dark:bg-[#F47B20]/10 border border-[#F47B20]/20 text-xs text-[#F47B20]" style={{ fontWeight: 600 }}>
                <Zap className="w-3 h-3" fill="currentColor" />
                {activeCount} ativo{activeCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-xs text-green-600 dark:text-green-400" style={{ fontWeight: 600 }}>
                <CheckCircle className="w-3 h-3" />
                {doneCount} concluído{doneCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Semester filter */}
            <div className="relative">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="appearance-none bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] pl-3 pr-8 py-2 text-xs text-[#1F2937] dark:text-[#F9FAFB] focus:outline-none focus:border-[#3B5CCC] dark:focus:border-[#4F6EF7] transition-colors cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s === "Todos" ? "Todos os semestres" : `Semestre ${s}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#64748B] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <EmptyState semester={semester} />
        ) : (
          filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}