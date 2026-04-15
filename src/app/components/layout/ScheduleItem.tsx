import type { ScheduleEvent } from "../../data/mockSchedule";

interface ScheduleItemProps {
  event: ScheduleEvent;
}

export default function ScheduleItem({ event }: ScheduleItemProps) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-2 py-2 rounded-lg",
        event.isToday ? "bg-[var(--schedule-today-bg)]" : "",
      ].join(" ")}
    >
      <div
        className={[
          "w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0 text-center leading-tight",
          event.isToday
            ? "bg-[var(--blue)] text-white"
            : "bg-gray-100 text-[var(--text-secondary)]",
        ].join(" ")}
      >
        <span className="text-[11px] font-bold">{event.dayAbbr}</span>
        <span className="text-[9px]">{event.time}</span>
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={[
            "text-sm truncate",
            event.isToday
              ? "font-semibold text-[var(--text-primary)]"
              : "text-[var(--text-primary)]",
          ].join(" ")}
        >
          {event.title}
        </span>
        {event.isToday && (
          <span className="text-xs font-semibold text-accent">Hoje</span>
        )}
      </div>
    </div>
  );
}
