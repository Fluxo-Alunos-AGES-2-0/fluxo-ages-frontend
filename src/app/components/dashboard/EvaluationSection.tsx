import { BarChart3, CheckCircle, Clock, User } from "lucide-react";
import { SectionCard } from "./SectionCard";

interface Grade {
  id: string;
  label: string;
  score: number | null;
  max: number;
  status: "concluido" | "andamento" | "pendente";
  date: string;
}

const GRADES: Grade[] = [
  { id: "s1", label: "Sprint 1", score: 9.5, max: 10, status: "concluido", date: "07 Mar" },
  { id: "s2", label: "Sprint 2", score: 8.8, max: 10, status: "concluido", date: "14 Mar" },
  { id: "s3", label: "Sprint 3", score: null, max: 10, status: "andamento", date: "21 Mar" },
  { id: "rf", label: "Relatório Final", score: null, max: 10, status: "pendente", date: "29 Mar" },
];

const ATTENDANCE = { percentage: 92, attended: 23, total: 25 };

function GradeBar({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const color =
    pct >= 85
      ? "from-[#3B5CCC] to-[#5B7AE8] dark:from-[#4F6EF7] dark:to-[#7B93FB]"
      : pct >= 70
      ? "from-[#F47B20] to-[#f59c4f]"
      : "from-red-400 to-red-500";
  return (
    <div className="relative h-1.5 rounded-full bg-[#E5E7EB] dark:bg-[#334155] overflow-hidden w-20 flex-shrink-0">
      <div
        className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function GradeRow({ grade }: { grade: Grade }) {
  const isConcluido = grade.status === "concluido";
  const isAndamento = grade.status === "andamento";

  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#E5E7EB] dark:border-[#334155] last:border-0">
      {/* Status icon */}
      <div className="flex-shrink-0">
        {isConcluido ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : isAndamento ? (
          <Clock className="w-4 h-4 text-[#F47B20]" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-[#D1D5DB] dark:border-[#475569]" />
        )}
      </div>

      {/* Label + date */}
      <div className="flex-1 min-w-0">
        <span
          className="text-sm text-[#1F2937] dark:text-[#F9FAFB]"
          style={{ fontWeight: isConcluido ? 600 : 400 }}
        >
          {grade.label}
        </span>
        <span className="text-xs text-[#9CA3AF] dark:text-[#64748B] ml-2">
          {grade.date}
        </span>
      </div>

      {/* Score or status */}
      {isConcluido && grade.score !== null ? (
        <div className="flex items-center gap-3 flex-shrink-0">
          <GradeBar score={grade.score} max={grade.max} />
          <span
            className={[
              "text-sm tabular-nums",
              grade.score >= 8.5
                ? "text-[#3B5CCC] dark:text-[#4F6EF7]"
                : grade.score >= 7
                ? "text-[#F47B20]"
                : "text-red-500",
            ].join(" ")}
            style={{ fontWeight: 700 }}
          >
            {grade.score.toFixed(1)}
          </span>
          <span className="text-xs text-[#9CA3AF] dark:text-[#64748B]">
            /{grade.max}
          </span>
        </div>
      ) : isAndamento ? (
        <span
          className="text-xs px-2.5 py-1 rounded-full bg-[#FFF5EC] dark:bg-[#F47B20]/10 text-[#F47B20] border border-[#F47B20]/30"
          style={{ fontWeight: 600 }}
        >
          Em andamento
        </span>
      ) : (
        <span
          className="text-xs px-2.5 py-1 rounded-full bg-[#F5F6FA] dark:bg-[#334155]/40 text-[#9CA3AF] dark:text-[#64748B] border border-[#E5E7EB] dark:border-[#334155]"
          style={{ fontWeight: 500 }}
        >
          Pendente
        </span>
      )}
    </div>
  );
}

export function EvaluationSection() {
  const avgScore =
    GRADES.filter((g) => g.score !== null).reduce(
      (acc, g) => acc + (g.score ?? 0),
      0
    ) / GRADES.filter((g) => g.score !== null).length;

  return (
    <SectionCard
      title="Avaliações"
      subtitle="Notas e frequência do semestre"
      icon={<BarChart3 className="w-4 h-4" />}
      accent
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grades column */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4
              className="text-xs text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wide"
              style={{ fontWeight: 600 }}
            >
              Notas por Sprint
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#9CA3AF] dark:text-[#64748B]">Média atual:</span>
              <span
                className="text-sm text-[#3B5CCC] dark:text-[#4F6EF7]"
                style={{ fontWeight: 700 }}
              >
                {avgScore.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="mt-2">
            {GRADES.map((g) => (
              <GradeRow key={g.id} grade={g} />
            ))}
          </div>
        </div>

        {/* Attendance column */}
        <div>
          <h4
            className="text-xs text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wide mb-4"
            style={{ fontWeight: 600 }}
          >
            Frequência
          </h4>

          {/* Big attendance circle */}
          <div className="flex flex-col items-center py-4 gap-2">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="currentColor"
                  className="text-[#E5E7EB] dark:text-[#334155]"
                  strokeWidth="10"
                />
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="currentColor"
                  className="text-[#3B5CCC] dark:text-[#4F6EF7]"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - ATTENDANCE.percentage / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-[22px] text-[#1F2937] dark:text-[#F9FAFB] leading-none"
                  style={{ fontWeight: 700 }}
                >
                  {ATTENDANCE.percentage}%
                </span>
                <span className="text-[10px] text-[#9CA3AF] dark:text-[#64748B] mt-0.5">
                  Presença
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
                <span
                  className="text-[#1F2937] dark:text-[#F9FAFB]"
                  style={{ fontWeight: 600 }}
                >
                  {ATTENDANCE.attended}
                </span>{" "}
                de{" "}
                <span style={{ fontWeight: 600 }}>{ATTENDANCE.total}</span>{" "}
                aulas presentes
              </p>
            </div>
          </div>

          {/* Attendance info */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] bg-[#EEF2FF] dark:bg-[#3B5CCC]/10 mt-2">
            <User className="w-3.5 h-3.5 text-[#3B5CCC] dark:text-[#4F6EF7] flex-shrink-0" />
            <p className="text-xs text-[#3B5CCC] dark:text-[#4F6EF7]">
              <span style={{ fontWeight: 600 }}>Frequência excelente</span> ·
              Mínimo exigido: 75%
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
