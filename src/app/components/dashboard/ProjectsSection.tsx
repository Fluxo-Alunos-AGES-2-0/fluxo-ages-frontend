import { FolderOpen, GitBranch, Calendar, ExternalLink, Clock } from "lucide-react";
import { SectionCard } from "./SectionCard";

interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "ativo" | "concluido";
  tech: string[];
  gitlabUrl: string;
  role: string;
  semester: string;
}

const PROJECTS: Project[] = [
  {
    id: "atual",
    title: "Sistema de Gestão Acadêmica",
    description:
      "Plataforma web para gestão de frequência, notas e atividades de alunos universitários. Desenvolvida com React, Node.js e PostgreSQL usando metodologia Scrum.",
    date: "Mar 2025 – presente",
    status: "ativo",
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    gitlabUrl: "https://tools.ages.pucrs.br",
    role: "Desenvolvedor Full-Stack",
    semester: "2025/1",
  },
  {
    id: "passado",
    title: "App de Controle de Biblioteca",
    description:
      "Aplicação mobile para empréstimo e devolução de livros, com notificações de prazo e catálogo digital integrado.",
    date: "Ago 2024 – Dez 2024",
    status: "concluido",
    tech: ["React Native", "Firebase", "Expo"],
    gitlabUrl: "https://tools.ages.pucrs.br",
    role: "Desenvolvedor Mobile",
    semester: "2024/2",
  },
];

function TechTag({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#3B5CCC]/20 text-[#3B5CCC] dark:text-[#4F6EF7] text-[11px]"
      style={{ fontWeight: 600 }}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isActive = project.status === "ativo";

  return (
    <div
      className={[
        "rounded-[10px] border p-5 transition-all duration-200 hover:shadow-md",
        isActive
          ? "border-[#3B5CCC]/30 dark:border-[#4F6EF7]/30 bg-[#EEF2FF]/30 dark:bg-[#3B5CCC]/5"
          : "border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] opacity-80 hover:opacity-100",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div
            className={[
              "w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5",
              isActive
                ? "bg-[#3B5CCC] dark:bg-[#4F6EF7] text-white"
                : "bg-[#F5F6FA] dark:bg-[#334155]/60 text-[#9CA3AF] dark:text-[#64748B]",
            ].join(" ")}
          >
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className="text-sm text-[#1F2937] dark:text-[#F9FAFB]"
                style={{ fontWeight: 700 }}
              >
                {project.title}
              </h4>
              <span
                className={[
                  "px-2 py-0.5 rounded-full text-[11px]",
                  isActive
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/40"
                    : "bg-[#F5F6FA] dark:bg-[#334155]/40 text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#334155]",
                ].join(" ")}
                style={{ fontWeight: 600 }}
              >
                {isActive ? "Em andamento" : "Concluído"}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
              {project.role}
            </p>
          </div>
        </div>

        {/* GitLab link */}
        <a
          href={project.gitlabUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E5E7EB] dark:border-[#334155] text-[#6B7280] dark:text-[#94A3B8] hover:border-[#3B5CCC] dark:hover:border-[#4F6EF7] hover:text-[#3B5CCC] dark:hover:text-[#4F6EF7] transition-colors flex-shrink-0 text-xs"
          style={{ fontWeight: 500 }}
        >
          <GitBranch className="w-3.5 h-3.5" />
          GitLab
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>

      {/* Description */}
      <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <TechTag key={t} label={t} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#9CA3AF] dark:text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {project.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {project.semester}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <SectionCard
      title="Projetos"
      subtitle="Projetos atuais e histórico acadêmico"
      icon={<FolderOpen className="w-4 h-4" />}
    >
      <div className="space-y-4">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </SectionCard>
  );
}
