import {
  CircleCheckBig,
  ExternalLink,
  GitBranch,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/app/components/ui/Button/Button";

type ProjectStatus = "ATIVO" | "CONCLUIDO";

interface Project {
  id: number;
  name: string;
  scheduleCode: string;
  semester: string;
  agesLevel: string;
  membersCount: number;
  description: string;
  status: ProjectStatus;
  repositoryUrl: string;
  imageUrl: string;
  clients: string;
  advisor: string;
  studentsByAges: {
    agesI: string[];
    agesII: string[];
    agesIII: string[];
    agesIV: string[];
  };
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "FluxoAGES 2.0",
    scheduleCode: "6LMNP",
    semester: "2026/1",
    agesLevel: "AGES IV",
    membersCount: 14,
    description:
      "O Fluxo AGES é uma plataforma web que centraliza a gestão acadêmica e de portfólio dos alunos da AGES, oferecendo um ambiente único para alunos, professores e equipe administrativa. O objetivo é modernizar o sistema com uma arquitetura escalável e boa usabilidade, respeitando as regras da PUCRS e da AGES.",
    status: "ATIVO",
    repositoryUrl: "https://github.com",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop",
    clients: "Willian Albeche e Marcelo Yamaguti",
    advisor: "Dilnei Venturini",
    studentsByAges: {
      agesI: ["Lucas Fernandes", "Higor Silva", "Ana Beatriz"],
      agesII: ["Mariana Costa", "Pedro Henrique", "João Victor"],
      agesIII: ["Gabriel Souza", "Camila Rocha", "Rafael Martins"],
      agesIV: ["Vinicius Pacheco", "Lucas Fernandes", "Augusto Oliveira"],
    },
  },
  {
    id: 2,
    name: "ClinAgenda",
    scheduleCode: "2LM 4LM",
    semester: "2025/2",
    agesLevel: "AGES III",
    membersCount: 10,
    description:
      "Sistema de agendamento online para clínicas e consultórios. Gestão de pacientes, agenda médica e notificações automáticas por e-mail e SMS.",
    status: "CONCLUIDO",
    repositoryUrl: "https://github.com",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
    clients: "Clínica Modelo",
    advisor: "Professor Orientador",
    studentsByAges: {
      agesI: ["Lucas Fernandes", "Higor Silva", "Ana Beatriz"],
      agesII: ["Mariana Costa", "Pedro Henrique", "João Victor"],
      agesIII: ["Gabriel Souza", "Camila Rocha", "Rafael Martins"],
      agesIV: ["Vinicius Pacheco", "Lucas Fernandes", "Augusto Oliveira"],
    },
  },
  {
    id: 3,
    name: "EduTrack",
    scheduleCode: "3JK 5JK",
    semester: "2025/1",
    agesLevel: "AGES II",
    membersCount: 11,
    description:
      "Ferramenta de acompanhamento de aprendizagem para professores e alunos. Dashboard de desempenho, gamificação e relatórios pedagógicos.",
    status: "CONCLUIDO",
    repositoryUrl: "https://github.com",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    clients: "Instituição de Ensino",
    advisor: "Professor Orientador",
    studentsByAges: {
      agesI: ["Lucas Fernandes", "Higor Silva", "Ana Beatriz"],
      agesII: ["Mariana Costa", "Pedro Henrique", "João Victor"],
      agesIII: ["Gabriel Souza", "Camila Rocha", "Rafael Martins"],
      agesIV: ["Vinicius Pacheco", "Lucas Fernandes", "Augusto Oliveira"],
    },
  },
  {
    id: 4,
    name: "StockWise",
    scheduleCode: "2JK 4JK",
    semester: "2024/2",
    agesLevel: "AGES I",
    membersCount: 13,
    description:
      "Gerenciador de estoque inteligente para pequenas e médias empresas. Controle de produtos, alertas de reposição e integração com notas fiscais.",
    status: "CONCLUIDO",
    repositoryUrl: "https://github.com",
    imageUrl:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop",
    clients: "Empresa Parceira",
    advisor: "Professor Orientador",
    studentsByAges: {
      agesI: ["Lucas Fernandes", "Higor Silva", "Ana Beatriz"],
      agesII: ["Mariana Costa", "Pedro Henrique", "João Victor"],
      agesIII: ["Gabriel Souza", "Camila Rocha", "Rafael Martins"],
      agesIV: ["Vinicius Pacheco", "Lucas Fernandes", "Augusto Oliveira"],
    },
  },
];

export default function ProjetoDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = mockProjects.find((item) => item.id === Number(id));
  const isAtivo = project?.status === "ATIVO";

  if (!project) {
    return (
      <div className="w-full flex flex-col gap-6 font-sans">
        <div className="bg-white rounded-2xl border border-[#6B728030] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1F2937]">
            Projeto não encontrado
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">
            O projeto solicitado não existe ou não está disponível.
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

  const handleRepositoryClick = () => {
    window.open(project.repositoryUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="bg-white rounded-2xl border border-[#6B728030] shadow-sm overflow-hidden">
        <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-[#6B728030]">
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-bold text-[#F47B20]">
              {project.name}
            </h2>

            <span className="text-sm text-[#6B7280] mb-[2px]">
              {project.scheduleCode}
            </span>
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="rounded-xl overflow-hidden border-b-4 border-[#F47B20]">
              <img
                src={project.imageUrl}
                alt={`Imagem do projeto ${project.name}`}
                className="w-full h-[260px] object-cover"
              />
            </div>

            <div className="flex flex-col gap-4">
              <AgesStudents
                title="AGES I"
                students={project.studentsByAges.agesI}
              />
              <AgesStudents
                title="AGES II"
                students={project.studentsByAges.agesII}
              />
              <AgesStudents
                title="AGES III"
                students={project.studentsByAges.agesIII}
              />
              <AgesStudents
                title="AGES IV"
                students={project.studentsByAges.agesIV}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#EEF3FF] rounded-xl p-6 min-h-[390px] flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-col gap-3 text-sm text-[#6B7280]">
                  <p>
                    <span className="font-semibold text-[#6B7280]">
                      Clientes AGES:
                    </span>{" "}
                    {project.clients}
                  </p>

                  <p>
                    <span className="font-semibold text-[#6B7280]">
                      Orientador(a):
                    </span>{" "}
                    {project.advisor}
                  </p>

                  <p className="flex items-center gap-1">
                    <Users size={15} />
                    <span>
                      {project.agesLevel} · {project.membersCount} membros ·{" "}
                      {project.semester}
                    </span>
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleRepositoryClick}
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

interface AgesStudentsProps {
  title: string;
  students: string[];
}

function AgesStudents({ title, students }: AgesStudentsProps) {
  return (
    <details className="group">
      <summary className="flex items-center gap-1 cursor-pointer list-none text-sm font-bold text-[#1F2937]">
        <span className="text-[#3B5CCC] transition-transform group-open:rotate-90">
          ▶
        </span>
        {title}
      </summary>

      <div className="mt-3 ml-5 flex flex-wrap gap-2">
        {students.length > 0 ? (
          students.map((student) => (
            <span
              key={student}
              className="px-3 py-1.5 rounded-full bg-[#6B728010] border border-[#6B728030] text-xs font-semibold text-[#6B7280]"
            >
              {student}
            </span>
          ))
        ) : (
          <span className="text-xs text-[#6B7280]">
            Nenhum aluno cadastrado.
          </span>
        )}
      </div>
    </details>
  );
}
