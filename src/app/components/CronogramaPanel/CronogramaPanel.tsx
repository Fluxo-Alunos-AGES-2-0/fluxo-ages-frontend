import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronsRight, CalendarX2, Loader2, Clock } from "lucide-react";
import {
  fetchSchedule,
  monthAbbr,
  dayOfMonth,
  parseEventDate,
  sortByDate,
  startOfToday,
  type ScheduleEventDto,
} from "@/app/services/scheduleService";
import {
  TURNO_OPTIONS,
  DEFAULT_TURNO,
  turnoLabel,
} from "@/app/data/turnoOptions";

interface CronogramaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Turno inicial selecionado no filtro (default: turno semeado). */
  initialTurno?: string;
}

/** Índice do evento em destaque: o do dia atual ou o próximo futuro. */
function highlightIndex(events: ScheduleEventDto[]): number {
  const today = startOfToday().getTime();
  return events.findIndex((event) => parseEventDate(event.date).getTime() >= today);
}

export function CronogramaPanel({
  isOpen,
  onClose,
  initialTurno = DEFAULT_TURNO,
}: CronogramaPanelProps) {
  const [turno, setTurno] = useState(initialTurno);
  const [events, setEvents] = useState<ScheduleEventDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setIsLoading(true);
    fetchSchedule(turno)
      .then((data) => {
        if (active) setEvents(sortByDate(data));
      })
      .catch(() => {
        if (active) setEvents([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, turno]);

  // Fecha o dropdown do filtro ao clicar fora.
  useEffect(() => {
    if (!filterOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  const highlighted = useMemo(() => highlightIndex(events), [events]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/40"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-[#1E2B49] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 pt-4 pb-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="p-1 -ml-1 mb-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors block"
            aria-label="Fechar cronograma"
          >
            <ChevronsRight className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold uppercase tracking-wide text-[#F47B20] m-0 flex-1 truncate">
              Cronograma
            </h2>

            {/* Filtro de turno */}
            <div className="relative shrink-0" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              className="flex items-center gap-1.5 bg-[#F47B20] hover:bg-[#E06F14] text-white text-[12px] font-semibold px-3 py-2 rounded-lg transition-colors shrink-0 whitespace-nowrap cursor-pointer"
            >
              <span>{turnoLabel(turno)}</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-[#e5e7eb] dark:border-[#334155] overflow-hidden z-10">
                {TURNO_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setTurno(option.value);
                      setFilterOpen(false);
                    }}
                    className={[
                      "w-full text-left px-4 py-2.5 text-[14px] transition-colors cursor-pointer",
                      option.value === turno
                        ? "bg-[#eef1fb] dark:bg-[#253657] text-[#3b5ccc] dark:text-[#93c5fd] font-semibold"
                        : "text-[#1f2937] dark:text-[#F4F6F7] hover:bg-gray-50 dark:hover:bg-[#253657]",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Lista de eventos */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/70">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-sm">Carregando cronograma...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/60 text-center px-6">
              <CalendarX2 className="w-10 h-10" />
              <span className="text-sm">
                Nenhum evento encontrado para este turno.
              </span>
            </div>
          ) : (
            events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                highlight={index === highlighted}
              />
            ))
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}

function EventCard({
  event,
  highlight,
}: {
  event: ScheduleEventDto;
  highlight: boolean;
}) {
  return (
    <div
      className={[
        "flex items-stretch rounded-2xl overflow-hidden shadow-sm",
        highlight
          ? "bg-gradient-to-r from-[#F5853B] to-[#E26F12]"
          : "bg-[#33437A]",
      ].join(" ")}
    >
      {/* Bloco mês/dia (faixa colorida à esquerda) */}
      <div
        className={[
          "w-[58px] shrink-0 flex flex-col items-center justify-center py-3.5",
          highlight ? "bg-[#D9650D]" : "bg-[#283660]",
        ].join(" ")}
      >
        <span className="text-[11px] font-semibold tracking-wide text-white/90">
          {monthAbbr(event.date)}
        </span>
        <span className="text-[22px] font-bold leading-none text-white">
          {dayOfMonth(event.date)}
        </span>
      </div>

      <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-1">
        <span className="text-[14px] font-medium text-white leading-snug">
          {event.title}
        </span>
        {event.time && (
          <span className="flex items-center gap-1 text-[12px] text-white/70">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {event.time}
          </span>
        )}
      </div>
    </div>
  );
}
