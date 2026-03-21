import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, ChevronDown, BookMarked } from "lucide-react";

type Turno = "Todos" | "Manhã" | "Tarde" | "Noite";
type Dia =
  | "Todos"
  | "Segunda"
  | "Terça"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sábado";

interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  turno: "Manhã" | "Tarde" | "Noite";
  dia: Dia;
  tag?: string;
}

const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 1,
    title: "Kickoff AGES I – Abertura do Semestre",
    date: "Seg, 17 Mar",
    time: "08:00 – 09:30",
    turno: "Manhã",
    dia: "Segunda",
    tag: "Evento",
  },
  {
    id: 2,
    title: "Formação de Times e Escolha de Projetos",
    date: "Seg, 17 Mar",
    time: "09:30 – 11:00",
    turno: "Manhã",
    dia: "Segunda",
    tag: "Organização",
  },
  {
    id: 3,
    title: "Sprint Planning – Sprint 1",
    date: "Ter, 18 Mar",
    time: "14:00 – 15:30",
    turno: "Tarde",
    dia: "Terça",
    tag: "Planning",
  },
  {
    id: 4,
    title: "Daily Standup – Todos os Times",
    date: "Qua, 19 Mar",
    time: "08:00 – 08:15",
    turno: "Manhã",
    dia: "Quarta",
    tag: "Daily",
  },
  {
    id: 5,
    title: "Workshop: Metodologia Ágil na Prática",
    date: "Qua, 19 Mar",
    time: "08:15 – 10:00",
    turno: "Manhã",
    dia: "Quarta",
    tag: "Workshop",
  },
  {
    id: 6,
    title: "Orientação com Professor Orientador",
    date: "Qui, 20 Mar",
    time: "18:00 – 19:00",
    turno: "Noite",
    dia: "Quinta",
    tag: "Orientação",
  },
  {
    id: 7,
    title: "Sprint Review – Apresentação do Sprint 1",
    date: "Qui, 20 Mar",
    time: "19:00 – 20:30",
    turno: "Noite",
    dia: "Quinta",
    tag: "Review",
  },
  {
    id: 8,
    title: "Retrospectiva do Sprint 1",
    date: "Sex, 21 Mar",
    time: "08:30 – 09:30",
    turno: "Manhã",
    dia: "Sexta",
    tag: "Retrospectiva",
  },
  {
    id: 9,
    title: "Entrega: Documento de Visão do Produto",
    date: "Sex, 21 Mar",
    time: "23:59",
    turno: "Noite",
    dia: "Sexta",
    tag: "Entrega",
  },
  {
    id: 10,
    title: "Sprint Planning – Sprint 2",
    date: "Seg, 24 Mar",
    time: "14:00 – 15:30",
    turno: "Tarde",
    dia: "Segunda",
    tag: "Planning",
  },
  {
    id: 11,
    title: "Workshop: Git e GitLab Avançado",
    date: "Ter, 25 Mar",
    time: "08:00 – 10:00",
    turno: "Manhã",
    dia: "Terça",
    tag: "Workshop",
  },
  {
    id: 12,
    title: "Code Review com Monitor de Projeto",
    date: "Qua, 26 Mar",
    time: "15:00 – 16:30",
    turno: "Tarde",
    dia: "Quarta",
    tag: "Review",
  },
  {
    id: 13,
    title: "Entrega Intermediária – MVP do Projeto",
    date: "Qui, 27 Mar",
    time: "23:59",
    turno: "Noite",
    dia: "Quinta",
    tag: "Entrega",
  },
  {
    id: 14,
    title: "Apresentação Intermediária de Projetos",
    date: "Sáb, 29 Mar",
    time: "09:00 – 12:00",
    turno: "Manhã",
    dia: "Sábado",
    tag: "Apresentação",
  },
  {
    id: 15,
    title: "Cerimônia de Encerramento do Semestre",
    date: "Sáb, 29 Mar",
    time: "14:00 – 16:00",
    turno: "Tarde",
    dia: "Sábado",
    tag: "Evento",
  },
];

const DIAS: Dia[] = [
  "Todos",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const TURNOS: Turno[] = ["Todos", "Manhã", "Tarde", "Noite"];

const TURNO_CONFIG: Record<
  "Manhã" | "Tarde" | "Noite",
  { bg: string; text: string; bar: string; dot: string }
> = {
  Manhã: {
    bg: "bg-sky-50",
    text: "text-sky-600",
    bar: "bg-sky-400",
    dot: "bg-sky-400",
  },
  Tarde: {
    bg: "bg-orange-50",
    text: "text-orange-500",
    bar: "bg-[#F47B20]",
    dot: "bg-[#F47B20]",
  },
  Noite: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    bar: "bg-violet-400",
    dot: "bg-violet-400",
  },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
}

interface CronogramaPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CronogramaPanel({ isOpen, onClose }: CronogramaPanelProps) {
  const [filterDia, setFilterDia] = useState<Dia>("Todos");
  const [filterTurno, setFilterTurno] = useState<Turno>("Todos");
  const isMobile = useIsMobile();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const filteredEvents = SCHEDULE_EVENTS.filter((event) => {
    const diaMatch = filterDia === "Todos" || event.dia === filterDia;
    const turnoMatch = filterTurno === "Todos" || event.turno === filterTurno;
    return diaMatch && turnoMatch;
  });

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  const modalVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            variants={isMobile ? modalVariants : drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className={[
              "absolute bg-[#F5F6FA] flex flex-col overflow-hidden",
              isMobile
                ? "inset-x-0 bottom-0 h-[95dvh] rounded-t-[20px] shadow-2xl"
                : "right-0 top-0 h-full w-full max-w-[500px] shadow-2xl",
            ].join(" ")}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#3B5CCC] flex items-center justify-center shadow-sm">
                  <BookMarked className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2
                    className="text-[#1F2937] text-base"
                    style={{ fontWeight: 600 }}
                  >
                    Cronograma AGES
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    {filteredEvents.length}{" "}
                    {filteredEvents.length === 1 ? "evento" : "eventos"}{" "}
                    encontrado{filteredEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F5F6FA] hover:text-[#1F2937] transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-white border-b border-[#E5E7EB]">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <select
                    value={filterDia}
                    onChange={(e) => setFilterDia(e.target.value as Dia)}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm rounded-[8px] border border-[#E5E7EB] bg-[#F5F6FA] text-[#1F2937] focus:outline-none focus:border-[#3B5CCC] focus:ring-2 focus:ring-[#3B5CCC]/20 cursor-pointer transition-all"
                  >
                    {DIAS.map((d) => (
                      <option key={d} value={d}>
                        {d === "Todos" ? "Todos os dias" : d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280] pointer-events-none" />
                </div>

                <div className="flex-1 relative">
                  <select
                    value={filterTurno}
                    onChange={(e) => setFilterTurno(e.target.value as Turno)}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm rounded-[8px] border border-[#E5E7EB] bg-[#F5F6FA] text-[#1F2937] focus:outline-none focus:border-[#3B5CCC] focus:ring-2 focus:ring-[#3B5CCC]/20 cursor-pointer transition-all"
                  >
                    {TURNOS.map((t) => (
                      <option key={t} value={t}>
                        {t === "Todos" ? "Todos os turnos" : t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-[#6B7280] gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                    <Calendar className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="text-center">
                    <p
                      className="text-sm text-[#1F2937]"
                      style={{ fontWeight: 500 }}
                    >
                      Nenhum evento encontrado
                    </p>
                    <p className="text-xs mt-1">
                      Tente ajustar os filtros acima
                    </p>
                  </div>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <EventListItem key={event.id} event={event} />
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function EventListItem({ event }: { event: ScheduleEvent }) {
  const config = TURNO_CONFIG[event.turno];

  return (
    <div className="flex gap-0 bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden hover:border-[#3B5CCC]/25 hover:shadow-sm transition-all duration-200">
      {/* Color bar */}
      <div className={`w-1 flex-shrink-0 ${config.bar}`} />

      {/* Content */}
      <div className="flex-1 px-4 py-3.5 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p
            className="text-sm text-[#1F2937] leading-snug"
            style={{ fontWeight: 500 }}
          >
            {event.title}
          </p>
          {event.tag && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5 ${config.bg} ${config.text}`}
              style={{ fontWeight: 600 }}
            >
              {event.tag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[#6B7280]">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B7280]">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs">{event.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
