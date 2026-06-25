import { X, Code2 } from "lucide-react";
import { useNavigate } from "react-router";
import groupPhoto from "../../assets/AGES.jpg";

const TEAM = {
  AGES1: ["Ana Lech", "Ellen Miranda", "Luiza Pereira", "Paulo Trevisan"],
  AGES2: [
    "Guilherme Ghise",
    "João Pedro Dal Agnol",
    "Nero Bratti",
    "Sergio Krautheim",
  ],
  AGES3: ["Felipe Seelend", "Thales Xavier", "Théo Miguel"],
  AGES4: ["Davi Iasculski", "Giuliano Roy", "Gustavo Pasquali"],
  PROFESSOR: ["Dilnei Venturini"],
  STAKEHOLDERS: ["Marcelo Yamaguti", "Willian Albeche"],
};

const TECNOLOGIES = [
  "TypeScript",
  "React",
  "Java",
  "Spring Boot",
  "PostgreSQL",
];

export default function SobrePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 font-sans pb-10">
      <div className="bg-white dark:bg-[#1E293B] rounded-[16px] border border-[#e5e7eb] dark:border-[#334155] p-10 relative shadow-sm">
        {/* Botão Fechar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 right-8 text-slate-400 dark:text-[#94A3B8] hover:text-slate-700 dark:hover:text-[#F4F6F7] transition-colors cursor-pointer"
          aria-label="Voltar"
        >
          <X size={28} strokeWidth={2} />
        </button>

        <div className="flex flex-col gap-12 max-w-5xl">
          {/* O que é o sistema */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] dark:text-[#F4F6F7] flex items-center gap-3 mb-4">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] dark:bg-[#3B5CCC] rounded-full block"></span>
              O que é o sistema AGES
            </h2>
            <p className="text-[15px] text-[#6b7280] dark:text-[#94A3B8] leading-relaxed">
              O Fluxo AGES é o sistema que gerencia todos os fluxos de controle
              da Agência Experimental de Engenharia de Software do curso de ES
              da Escola Politécnica da PUCRS. Ele permite o controle completo de
              horas trabalhadas, gestão de projetos, relatórios e acompanhamento
              de atividades acadêmicas.
            </p>
          </section>

          {/* Quem são os usuários */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] dark:text-[#F4F6F7] flex items-center gap-3 mb-6">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] dark:bg-[#3B5CCC] rounded-full block"></span>
              Quem são os usuários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#334155] rounded-xl p-8 text-center">
                <h3 className="text-[18px] font-bold text-[#1f2937] dark:text-[#F4F6F7] mb-3">
                  Alunos
                </h3>
                <p className="text-[14px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed">
                  Controlam suas horas trabalhadas, descrevem atividades e fazem
                  upload de relatórios.
                </p>
              </div>
              <div className="bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#334155] rounded-xl p-8 text-center">
                <h3 className="text-[18px] font-bold text-[#1f2937] dark:text-[#F4F6F7] mb-3">
                  Professores
                </h3>
                <p className="text-[14px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed">
                  Gerenciam turmas, baixam relatórios, fazem chamadas e validam
                  as horas dos alunos.
                </p>
              </div>
              <div className="bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#334155] rounded-xl p-8 text-center">
                <h3 className="text-[18px] font-bold text-[#1f2937] dark:text-[#F4F6F7] mb-3">
                  Administradores
                </h3>
                <p className="text-[14px] text-[#64748b] dark:text-[#94A3B8] leading-relaxed">
                  São os responsáveis pelos cadastros e manutenção dos dados da
                  Agência.
                </p>
              </div>
            </div>
          </section>

          {/* Tecnologias Utilizadas */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] dark:text-[#F4F6F7] flex items-center gap-3 mb-5">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] dark:bg-[#3B5CCC] rounded-full block"></span>
              Tecnologias Utilizadas
            </h2>
            <div className="flex flex-wrap gap-4">
              {TECNOLOGIES.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-[#f8fafc] dark:bg-[#334155] border border-[#e2e8f0] dark:border-[#334155] rounded-lg text-[#475569] dark:text-[#F4F6F7] font-medium text-[15px]"
                >
                  <Code2
                    size={18}
                    className="text-[#3b5ccc] dark:text-[#3B5CCC]"
                  />
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {/* Histórico & equipe */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] dark:text-[#F4F6F7] flex items-center gap-3 mb-4">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] dark:bg-[#3B5CCC] rounded-full block"></span>
              Histórico da equipe de Desenvolvimento
            </h2>
            <p className="text-[15px] text-[#6b7280] dark:text-[#94A3B8] leading-relaxed mb-6">
              O Fluxo AGES nasceu em 2015 e passou por diversas migrações ao
              longo de uma década. Em 2026/1, o sistema foi totalmente reescrito
              e modernizado pela equipe atual, trazendo uma interface focada em
              usabilidade e uma arquitetura escalável e robusta.
            </p>

            <div className="border border-[#e2e8f0] dark:border-[#334155] rounded-xl overflow-hidden mt-6">
              {/* Placeholder da Foto */}
              <div className=" bg-[#f1f5f9] dark:bg-[#334155] flex flex-col items-center justify-center border-b border-[#e2e8f0] dark:border-[#334155]">
                <img src={groupPhoto} />
              </div>

              {/* TEAM do Semestre */}
              <div className="p-8 bg-white dark:bg-[#1E293B]">
                <h3 className="text-[16px] font-bold text-[#1f2937] dark:text-[#F4F6F7] mb-6">
                  Equipe responsável
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 text-[14px]">
                  <div>
                    <strong className="text-[#334155] dark:text-[#F4F6F7] block mb-2">
                      AGES I
                    </strong>
                    <div className="flex flex-col gap-1 text-[#64748b] dark:text-[#94A3B8]">
                      {TEAM.AGES1.map((nome) => (
                        <span key={nome}>{nome}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-[#334155] dark:text-[#F4F6F7] block mb-2">
                      AGES II
                    </strong>
                    <div className="flex flex-col gap-1 text-[#64748b] dark:text-[#94A3B8]">
                      {TEAM.AGES2.map((nome) => (
                        <span key={nome}>{nome}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-[#334155] dark:text-[#F4F6F7] block mb-2">
                      AGES III
                    </strong>
                    <div className="flex flex-col gap-1 text-[#64748b] dark:text-[#94A3B8]">
                      {TEAM.AGES3.map((nome) => (
                        <span key={nome}>{nome}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-[#334155] dark:text-[#F4F6F7] block mb-2">
                      AGES IV
                    </strong>
                    <div className="flex flex-col gap-1 text-[#64748b] dark:text-[#94A3B8]">
                      {TEAM.AGES4.map((nome) => (
                        <span key={nome}>{nome}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-[#334155] dark:text-[#F4F6F7] block mb-2">
                      Professor Orientador
                    </strong>
                    <div className="flex flex-col gap-1 text-[#64748b] dark:text-[#94A3B8]">
                      {TEAM.PROFESSOR.map((nome) => (
                        <span key={nome}>{nome}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-[#334155] dark:text-[#F4F6F7] block mb-2">
                      Stakeholders
                    </strong>
                    <div className="flex flex-col gap-1 text-[#64748b] dark:text-[#94A3B8]">
                      {TEAM.STAKEHOLDERS.map((nome) => (
                        <span key={nome}>{nome}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
