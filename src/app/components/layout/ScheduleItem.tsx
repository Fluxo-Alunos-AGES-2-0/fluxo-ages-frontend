import type { ScheduleEvent } from "../../data/mockSchedule";

interface ScheduleItemProps {
  event: ScheduleEvent;
}

export default function ScheduleItem({ event }: ScheduleItemProps) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-2 py-1.5 rounded-xl",
        event.isToday ? "bg-[var(--schedule-today-bg)]" : "",
      ].join(" ")}
    >
      <div
        className={[
          "w-[44px] h-[44px] rounded-xl flex flex-col items-center justify-center shrink-0",
          event.isToday
            ? "bg-[var(--blue)] text-white"
            : "bg-gray-100 text-[var(--text-secondary)]",
        ].join(" ")}
      >
        <span className="text-[11px] font-bold leading-none">
          {event.dayAbbr}
        </span>
        <span className="text-[9px] leading-none mt-0.5">{event.time}</span>
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={[
            "text-[14px] truncate",
            event.isToday
              ? "font-semibold text-[var(--text-primary)]"
              : "text-[var(--text-primary)]",
          ].join(" ")}
        >
          {event.title}
        </span>
        {event.isToday && (
          <span className="text-[12px] font-semibold text-accent">Hoje</span>
        )}
      </div>
    </div>
  );
}
