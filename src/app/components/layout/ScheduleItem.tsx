import type { ScheduleEvent } from "../../data/mockSchedule";

interface ScheduleItemProps {
  event: ScheduleEvent;
}

export default function ScheduleItem({ event }: ScheduleItemProps) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
        event.isToday ? "bg-[var(--schedule-today-bg)]" : "",
      ].join(" ")}
    >
      <div className="flex flex-col items-center w-8 shrink-0">
        <span
          className={[
            "text-[10px] font-semibold uppercase leading-tight",
            event.isToday ? "text-accent" : "text-[var(--text-secondary)]",
          ].join(" ")}
        >
          {event.dayAbbr}
        </span>
        {event.time && (
          <span className="text-[10px] text-[var(--text-secondary)] leading-tight">
            {event.time}
          </span>
        )}
      </div>
      <span className="text-[var(--text-primary)] text-sm flex-1 truncate">
        {event.title}
      </span>
      {event.isToday && (
        <span className="text-[10px] font-bold uppercase bg-accent text-white px-1.5 py-0.5 rounded">
          Hoje
        </span>
      )}
    </div>
  );
}
