import { useState, useRef } from "react";
import {
  FileText,
  Clock,
  Upload,
  File,
  X,
  CheckCircle,
  Send,
  Download,
  Plus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "horas" | "sprint" | "andamento" | "final";

const TABS: { id: TabId; label: string }[] = [
  { id: "horas", label: "Horas" },
  { id: "sprint", label: "Sprint" },
  { id: "andamento", label: "Andamento" },
  { id: "final", label: "Final" },
];

// ─── Mock data ────────────────────────────────────────────────────────────────
const HOURS_LOG = [
  { id: 1,  date: "19/03/2026", duration: "2h 30min", description: "Desenvolvimento da tela de login e validações de formulário" },
  { id: 2,  date: "18/03/2026", duration: "3h 00min", description: "Revisão de código e correção de bugs no módulo de autenticação" },
  { id: 3,  date: "17/03/2026", duration: "4h 00min", description: "Sprint planning e estimativas de story points" },
  { id: 4,  date: "14/03/2026", duration: "3h 30min", description: "Implementação dos componentes do dashboard" },
  { id: 5,  date: "13/03/2026", duration: "2h 00min", description: "Daily standup e atualização do Jira" },
  { id: 6,  date: "12/03/2026", duration: "5h 00min", description: "Desenvolvimento das funcionalidades de relatório" },
  { id: 7,  date: "11/03/2026", duration: "3h 00min", description: "Code review e documentação técnica" },
  { id: 8,  date: "10/03/2026", duration: "4h 30min", description: "Implementação da sidebar e topbar do dashboard" },
  { id: 9,  date: "07/03/2026", duration: "3h 00min", description: "Configuração do ambiente e dependências do projeto" },
  { id: 10, date: "06/03/2026", duration: "4h 00min", description: "Definição da arquitetura de componentes" },
  { id: 11, date: "05/03/2026", duration: "3h 30min", description: "Reunião de kick-off e alinhamento da equipe" },
  { id: 12, date: "04/03/2026", duration: "4h 00min", description: "Prototipação de telas no Figma" },
];

interface SprintReport {
  id: number;
  sprint: number;
  time: string;
  submittedAt: string;
  status: "enviado";
}

const SPRINT_REPORTS_INITIAL: SprintReport[] = [
  { id: 1, sprint: 3, time: "AGES III", submittedAt: "13/03/2026", status: "enviado" },
  { id: 2, sprint: 2, time: "AGES III", submittedAt: "27/02/2026", status: "enviado" },
  { id: 3, sprint: 1, time: "AGES III", submittedAt: "13/02/2026", status: "enviado" },
];

const FORM_INITIAL = {
  time: "",
  sprint: "",
  atividadesPrevistas: "",
  atividadesConcluidas: "",
  problemasEncontrados: "",
  licoesAprendidas: "",
  proximosPassos: "",
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const INPUT_CLS =
  "w-full bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] px-3 py-2 text-sm text-[#1F2937] dark:text-[#F9FAFB] placeholder-[#9CA3AF] dark:placeholder-[#64748B] focus:outline-none focus:border-[#3B5CCC] dark:focus:border-[#4F6EF7] transition-colors";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs text-[#6B7280] dark:text-[#94A3B8]" style={{ fontWeight: 600 }}>
      {children}
    </label>
  );
}

// ─── HORAS TAB ────────────────────────────────────────────────────────────────
function HorasTab() {
  return (
    <div>
      {/* Summary banner */}
      <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-[10px] bg-[#EEF2FF] dark:bg-[#3B5CCC]/10 border border-[#3B5CCC]/15 dark:border-[#3B5CCC]/25">
        <Clock className="w-4 h-4 text-[#3B5CCC] dark:text-[#4F6EF7] flex-shrink-0" />
        <p className="text-xs text-[#3B5CCC] dark:text-[#4F6EF7]">
          <span style={{ fontWeight: 700 }}>42h concluídas</span> de 60h totais —{" "}
          <span style={{ fontWeight: 700 }}>18h restantes</span> para concluir.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[10px] border border-[#E5E7EB] dark:border-[#334155]">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="bg-[#F5F6FA] dark:bg-[#0F172A]/60">
              <th
                className="text-left px-4 py-3 text-xs text-[#6B7280] dark:text-[#94A3B8] border-b border-[#E5E7EB] dark:border-[#334155] w-[110px]"
                style={{ fontWeight: 600 }}
              >
                Data
              </th>
              <th
                className="text-left px-4 py-3 text-xs text-[#6B7280] dark:text-[#94A3B8] border-b border-[#E5E7EB] dark:border-[#334155] w-[100px]"
                style={{ fontWeight: 600 }}
              >
                Duração
              </th>
              <th
                className="text-left px-4 py-3 text-xs text-[#6B7280] dark:text-[#94A3B8] border-b border-[#E5E7EB] dark:border-[#334155]"
                style={{ fontWeight: 600 }}
              >
                Descrição
              </th>
            </tr>
          </thead>
          <tbody>
            {HOURS_LOG.map((row, i) => (
              <tr
                key={row.id}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-[#1E293B]"
                    : "bg-[#F5F6FA]/60 dark:bg-[#0F172A]/30"
                }
              >
                <td className="px-4 py-3 text-xs text-[#6B7280] dark:text-[#94A3B8] whitespace-nowrap border-b border-[#E5E7EB]/50 dark:border-[#334155]/50" style={{ fontWeight: 600 }}>
                  {row.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-b border-[#E5E7EB]/50 dark:border-[#334155]/50">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#3B5CCC]/15 text-[#3B5CCC] dark:text-[#4F6EF7] text-xs"
                    style={{ fontWeight: 700 }}
                  >
                    <Clock className="w-3 h-3" />
                    {row.duration}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#1F2937] dark:text-[#F9FAFB] border-b border-[#E5E7EB]/50 dark:border-[#334155]/50">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SPRINT TAB ───────────────────────────────────────────────────────────────
function SprintTab() {
  const [reports, setReports] = useState<SprintReport[]>(SPRINT_REPORTS_INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(FORM_INITIAL);

  const closeModal = () => {
    setModalOpen(false);
    setForm(FORM_INITIAL);
  };

  const handleSubmit = () => {
    if (!form.time || !form.sprint) return;
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    const sprintNum = parseInt(form.sprint.replace("Sprint ", ""), 10);
    setReports((prev) => [
      { id: Date.now(), sprint: sprintNum, time: form.time, submittedAt: date, status: "enviado" },
      ...prev,
    ]);
    closeModal();
  };

  const TEXTAREA_FIELDS = [
    { key: "atividadesPrevistas",  label: "Atividades Previstas" },
    { key: "atividadesConcluidas", label: "Atividades Concluídas" },
    { key: "problemasEncontrados", label: "Problemas Encontrados" },
    { key: "licoesAprendidas",     label: "Lições Aprendidas" },
    { key: "proximosPassos",       label: "Próximos Passos" },
  ] as const;

  return (
    <>
      {/* Action bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
          {reports.length} relatório{reports.length !== 1 ? "s" : ""} enviado{reports.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3B5CCC] hover:opacity-90 text-white rounded-[8px] text-sm transition-opacity cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-3.5 h-3.5" />
          Novo relatório
        </button>
      </div>

      {/* Reports table */}
      <div className="overflow-x-auto rounded-[10px] border border-[#E5E7EB] dark:border-[#334155]">
        <table className="w-full text-sm min-w-[440px]">
          <thead>
            <tr className="bg-[#F5F6FA] dark:bg-[#0F172A]/60">
              {["Sprint", "Time", "Enviado em", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs text-[#6B7280] dark:text-[#94A3B8] border-b border-[#E5E7EB] dark:border-[#334155]"
                  style={{ fontWeight: 600 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr
                key={r.id}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-[#1E293B]"
                    : "bg-[#F5F6FA]/60 dark:bg-[#0F172A]/30"
                }
              >
                <td className="px-4 py-3 border-b border-[#E5E7EB]/50 dark:border-[#334155]/50">
                  <span className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 600 }}>
                    Sprint {r.sprint}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#6B7280] dark:text-[#94A3B8] border-b border-[#E5E7EB]/50 dark:border-[#334155]/50">
                  {r.time}
                </td>
                <td className="px-4 py-3 text-xs text-[#6B7280] dark:text-[#94A3B8] border-b border-[#E5E7EB]/50 dark:border-[#334155]/50">
                  {r.submittedAt}
                </td>
                <td className="px-4 py-3 border-b border-[#E5E7EB]/50 dark:border-[#334155]/50">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/40"
                    style={{ fontWeight: 600 }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    Enviado
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-[12px] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#334155] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[6px] bg-[#EEF2FF] dark:bg-[#3B5CCC]/20 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-[#3B5CCC] dark:text-[#4F6EF7]" />
                </div>
                <span className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 700 }}>
                  Novo Relatório de Sprint
                </span>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-[6px] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 text-[#6B7280] dark:text-[#94A3B8] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {/* Time + Sprint row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Time</FieldLabel>
                  <select
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className={INPUT_CLS}
                  >
                    <option value="">Selecionar time</option>
                    {["AGES I", "AGES II", "AGES III", "AGES IV", "AGES V"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Sprint</FieldLabel>
                  <select
                    value={form.sprint}
                    onChange={(e) => setForm((f) => ({ ...f, sprint: e.target.value }))}
                    className={INPUT_CLS}
                  >
                    <option value="">Selecionar sprint</option>
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={`Sprint ${n}`}>Sprint {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Textarea fields */}
              {TEXTAREA_FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <FieldLabel>{field.label}</FieldLabel>
                  <textarea
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    rows={3}
                    placeholder={`Descreva as ${field.label.toLowerCase()}...`}
                    className={`${INPUT_CLS} resize-none`}
                  />
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] dark:border-[#334155] flex-shrink-0">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-sm text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.time || !form.sprint}
                className="px-4 py-2 bg-[#3B5CCC] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-[8px] text-sm transition-opacity cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                Cadastrar Relatório
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── UPLOAD TAB (Andamento + Final) ──────────────────────────────────────────
function UploadTab() {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") return;
    const mb = file.size / (1024 * 1024);
    const size = mb >= 1 ? `${mb.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
    setUploadedFile({ name: file.name, size });
  };

  return (
    <div>
      {/* Action bar */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-[#3B5CCC] hover:opacity-90 text-white rounded-[8px] text-sm transition-opacity cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          <Upload className="w-3.5 h-3.5" />
          Novo relatório
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-sm text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/50 transition-colors cursor-pointer"
          title="Template de documento"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Template</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* Current uploaded file */}
      {uploadedFile && (
        <div className="flex items-center gap-3 p-4 rounded-[10px] border border-[#3B5CCC]/20 bg-[#EEF2FF] dark:bg-[#3B5CCC]/10 dark:border-[#3B5CCC]/30 mb-4">
          <div className="w-9 h-9 rounded-[8px] bg-[#3B5CCC] flex items-center justify-center flex-shrink-0">
            <File className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#1F2937] dark:text-[#F9FAFB] truncate" style={{ fontWeight: 600 }}>
              {uploadedFile.name}
            </p>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
              {uploadedFile.size} · PDF
            </p>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="p-1.5 rounded-[6px] hover:bg-red-50 dark:hover:bg-red-900/20 text-[#6B7280] dark:text-[#94A3B8] hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) processFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={[
          "border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center py-14 gap-3 cursor-pointer transition-all duration-200",
          isDragging
            ? "border-[#3B5CCC] bg-[#EEF2FF] dark:bg-[#3B5CCC]/10"
            : "border-[#E5E7EB] dark:border-[#334155] hover:border-[#3B5CCC]/40 hover:bg-[#F5F6FA] dark:hover:bg-[#334155]/20",
        ].join(" ")}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isDragging ? "bg-[#3B5CCC]" : "bg-[#F5F6FA] dark:bg-[#334155]/60"
          }`}
        >
          <Upload
            className={`w-5 h-5 transition-colors ${
              isDragging ? "text-white" : "text-[#9CA3AF] dark:text-[#64748B]"
            }`}
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 600 }}>
            {uploadedFile ? "Substituir arquivo" : "Arraste o PDF aqui"}
          </p>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-1">
            ou{" "}
            <span className="text-[#3B5CCC] dark:text-[#4F6EF7]" style={{ fontWeight: 600 }}>
              clique para selecionar
            </span>
          </p>
          <p className="text-xs text-[#9CA3AF] dark:text-[#64748B] mt-1">Apenas arquivos PDF</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function RelatoriosContent() {
  const [activeTab, setActiveTab] = useState<TabId>("horas");

  return (
    <div
      className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden transition-colors duration-300"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
    >
      {/* Accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#3B5CCC] to-[#5B7AE8]" />

      {/* Card header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
        <FileText className="w-4 h-4 text-[#3B5CCC] dark:text-[#4F6EF7]" />
        <span className="text-sm text-[#1F2937] dark:text-[#F9FAFB]" style={{ fontWeight: 600 }}>
          Relatórios
        </span>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-0 border-b border-[#E5E7EB] dark:border-[#334155] px-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "relative px-4 py-3 text-sm transition-colors cursor-pointer",
                isActive
                  ? "text-[#3B5CCC] dark:text-[#4F6EF7]"
                  : "text-[#6B7280] dark:text-[#94A3B8] hover:text-[#1F2937] dark:hover:text-[#F9FAFB]",
              ].join(" ")}
              style={{ fontWeight: isActive ? 600 : 400 }}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B5CCC] dark:bg-[#4F6EF7] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === "horas"     && <HorasTab />}
        {activeTab === "sprint"    && <SprintTab />}
        {activeTab === "andamento" && <UploadTab />}
        {activeTab === "final"     && <UploadTab />}
      </div>
    </div>
  );
}
