import { useState } from "react";
import {
  FileText,
  Clock,
  Send,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Circle,
  ExternalLink,
  Upload,
} from "lucide-react";
import { SectionCard } from "./SectionCard";

type ReportStatus = "enviado" | "pendente" | "futuro";

interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  icon: React.ReactNode;
  date: string;
  actionLabel?: string;
}

const REPORTS: Report[] = [
  {
    id: "horas",
    title: "Relatório de Horas",
    description: "Abrir/fechar registros de horas trabalhadas",
    status: "pendente",
    icon: <Clock className="w-4 h-4" />,
    date: "Prazo: Sex, 21 Mar",
    actionLabel: "Abrir registro",
  },
  {
    id: "sprint",
    title: "Relatório de Sprint",
    description: "Sprint 3 — Entrega da documentação de sprint",
    status: "enviado",
    icon: <Send className="w-4 h-4" />,
    date: "Enviado em: Qui, 13 Mar",
    actionLabel: "Ver relatório",
  },
  {
    id: "ra",
    title: "Relatório de Avaliação (RA)",
    description: "Autoavaliação e avaliação do time",
    status: "pendente",
    icon: <FileText className="w-4 h-4" />,
    date: "Prazo: Sex, 21 Mar",
    actionLabel: "Preencher",
  },
  {
    id: "rf",
    title: "Relatório Final (RF)",
    description: "Entrega final do projeto — documentação completa",
    status: "futuro",
    icon: <Award className="w-4 h-4" />,
    date: "Prazo: Sáb, 29 Mar",
    actionLabel: "Em breve",
  },
];

const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; icon: React.ReactNode; badgeCls: string }
> = {
  enviado: {
    label: "Enviado",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    badgeCls:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/40",
  },
  pendente: {
    label: "Pendente",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    badgeCls:
      "bg-[#FFF5EC] dark:bg-[#F47B20]/10 text-[#F47B20] border border-[#F47B20]/30",
  },
  futuro: {
    label: "Futuro",
    icon: <Circle className="w-3.5 h-3.5" />,
    badgeCls:
      "bg-[#F5F6FA] dark:bg-[#334155]/40 text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#334155]",
  },
};

function ReportItem({ report }: { report: Report }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[report.status];
  const isPendente = report.status === "pendente";
  const isFuturo = report.status === "futuro";

  return (
    <div
      className={[
        "rounded-[10px] border transition-all duration-200",
        isPendente
          ? "border-[#F47B20]/30 bg-[#FFF5EC]/30 dark:bg-[#F47B20]/5 dark:border-[#F47B20]/20"
          : "border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B]",
      ].join(" ")}
    >
      <button
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Icon */}
        <div
          className={[
            "w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0",
            isPendente
              ? "bg-[#FFF5EC] dark:bg-[#F47B20]/10 text-[#F47B20]"
              : isFuturo
              ? "bg-[#F5F6FA] dark:bg-[#334155]/60 text-[#9CA3AF] dark:text-[#64748B]"
              : "bg-[#EEF2FF] dark:bg-[#3B5CCC]/20 text-[#3B5CCC] dark:text-[#4F6EF7]",
          ].join(" ")}
        >
          {report.icon}
        </div>

        {/* Title + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm text-[#1F2937] dark:text-[#F9FAFB]"
              style={{ fontWeight: 600 }}
            >
              {report.title}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
            {report.date}
          </p>
        </div>

        {/* Status badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs flex-shrink-0 ${cfg.badgeCls}`}
          style={{ fontWeight: 600 }}
        >
          {cfg.icon}
          {cfg.label}
        </div>

        {/* Expand toggle */}
        <div className="text-[#9CA3AF] dark:text-[#64748B] ml-2">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="px-5 pb-4 pt-0 border-t border-[#E5E7EB] dark:border-[#334155]">
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] pt-3 mb-4">
            {report.description}
          </p>

          <div className="flex items-center gap-3">
            {!isFuturo && (
              <button
                className={[
                  "flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm transition-all duration-200 cursor-pointer",
                  isPendente
                    ? "bg-[#F47B20] hover:bg-[#d96a15] text-white shadow-sm hover:shadow"
                    : "bg-[#3B5CCC] dark:bg-[#4F6EF7] hover:opacity-90 text-white shadow-sm hover:shadow",
                ].join(" ")}
                style={{ fontWeight: 600 }}
              >
                {isPendente ? (
                  <Upload className="w-3.5 h-3.5" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5" />
                )}
                {report.actionLabel}
              </button>
            )}
            {isFuturo && (
              <span className="text-xs text-[#9CA3AF] dark:text-[#64748B] px-3 py-2 rounded-[8px] bg-[#F5F6FA] dark:bg-[#334155]/40 border border-[#E5E7EB] dark:border-[#334155]">
                Disponível em breve
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ReportsSection() {
  return (
    <SectionCard
      title="Relatórios"
      subtitle="Gerencie e envie seus relatórios do semestre"
      icon={<FileText className="w-4 h-4" />}
      accent
    >
      <div className="space-y-3">
        {REPORTS.map((r) => (
          <ReportItem key={r.id} report={r} />
        ))}
      </div>
    </SectionCard>
  );
}
