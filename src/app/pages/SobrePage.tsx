import { X, Code2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function SobrePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 font-sans pb-10">
      <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-10 relative shadow-sm">
        
        {/* Botão Fechar */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Voltar"
        >
          <X size={28} strokeWidth={2} />
        </button>

        <div className="flex flex-col gap-12 max-w-5xl">
          
          {/* O que é o sistema */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] flex items-center gap-3 mb-4">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] rounded-full block"></span>
              O que é o sistema AGES
            </h2>
            <p className="text-[15px] text-[#6b7280] leading-relaxed">
              O Fluxo AGES é o sistema que gerencia todos os fluxos de controle da Agência Experimental de Engenharia de Software do curso de ES da Escola Politécnica da PUCRS. Ele permite o controle completo de horas trabalhadas, gestão de projetos, relatórios e acompanhamento de atividades acadêmicas.
            </p>
          </section>

          {/* Quem são os usuários */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] flex items-center gap-3 mb-6">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] rounded-full block"></span>
              Quem são os usuários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8 text-center">
                <h3 className="text-[18px] font-bold text-[#1f2937] mb-3">Alunos</h3>
                <p className="text-[14px] text-[#64748b] leading-relaxed">
                  Controlam suas horas trabalhadas, descrevem atividades e fazem upload de relatórios.
                </p>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8 text-center">
                <h3 className="text-[18px] font-bold text-[#1f2937] mb-3">Professores</h3>
                <p className="text-[14px] text-[#64748b] leading-relaxed">
                  Gerenciam turmas, baixam relatórios, fazem chamadas e validam as horas dos alunos.
                </p>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8 text-center">
                <h3 className="text-[18px] font-bold text-[#1f2937] mb-3">Administradores</h3>
                <p className="text-[14px] text-[#64748b] leading-relaxed">
                  São os responsáveis pelos cadastros e manutenção dos dados da Agência.
                </p>
              </div>
            </div>
          </section>

          {/* Tecnologias Utilizadas */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] flex items-center gap-3 mb-5">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] rounded-full block"></span>
              Tecnologias Utilizadas
            </h2>
            <div className="flex flex-wrap gap-4">
              {['React', 'Java', 'Spring Boot', 'PostgreSQL'].map(tech => (
                <div key={tech} className="flex items-center gap-2.5 px-5 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#475569] font-medium text-[15px]">
                  <Code2 size={18} className="text-[#3b5ccc]" />
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {/* Histórico & Equipe */}
          <section>
            <h2 className="text-[22px] font-bold text-[#1f2937] flex items-center gap-3 mb-4">
              <span className="w-[5px] h-[26px] bg-[#3b5ccc] rounded-full block"></span>
              Histórico da Equipe de Desenvolvimento
            </h2>
            <p className="text-[15px] text-[#6b7280] leading-relaxed mb-6">
              O Fluxo AGES nasceu em 2015 e passou por diversas migrações ao longo de uma década. Em 2026/1, o sistema foi totalmente reescrito e modernizado pela equipe atual, trazendo uma interface focada em usabilidade e uma arquitetura escalável e robusta.
            </p>
            
            <div className="border border-[#e2e8f0] rounded-xl overflow-hidden mt-6">
              {/* Placeholder da Foto */}
              <div className="h-[250px] bg-[#f1f5f9] flex flex-col items-center justify-center border-b border-[#e2e8f0]">
                <span className="text-[#94a3b8] font-semibold text-lg flex flex-col items-center gap-3">
                  📷 [Inserir Foto da Equipe Aqui]
                </span>
              </div>
              
              {/* Cargos */}
              <div className="p-8 bg-white">
                <h3 className="text-[16px] font-bold text-[#1f2937] mb-6">Atribuições do Semestre</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 text-[14px]">
                  <div><strong className="text-[#334155] block mb-1">AGES I</strong> <span className="text-[#64748b]">Desenvolvimento Base & UX/UI</span></div>
                  <div><strong className="text-[#334155] block mb-1">AGES II</strong> <span className="text-[#64748b]">Desenvolvimento Fullstack</span></div>
                  <div><strong className="text-[#334155] block mb-1">AGES III</strong> <span className="text-[#64748b]">Arquitetura & Code Review</span></div>
                  <div><strong className="text-[#334155] block mb-1">AGES IV</strong> <span className="text-[#64748b]">Gestão de Projetos & DevOps</span></div>
                  <div><strong className="text-[#334155] block mb-1">Professor Orientador</strong> <span className="text-[#64748b]">Diretrizes e Mentoria Técnica</span></div>
                  <div><strong className="text-[#334155] block mb-1">Stakeholders</strong> <span className="text-[#64748b]">Validação das Regras de Negócio</span></div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}