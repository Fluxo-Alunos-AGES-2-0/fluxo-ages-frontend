import { api } from "./api";

export interface ScheduleEventDto {
  id: number;
  title: string;
  description: string | null;
  /** ISO date "YYYY-MM-DD" */
  date: string;
  /** Faixa livre, ex.: "19:15 - 22:30" */
  time: string;
  sprint: number | null;
  categories: string[];
}

/** GET /schedule?diaTurno= (endpoint público). */
export function fetchSchedule(diaTurno: string): Promise<ScheduleEventDto[]> {
  return api.get<ScheduleEventDto[]>(
    `/schedule?diaTurno=${encodeURIComponent(diaTurno)}`,
  );
}

const MONTHS_ABBR = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

const WEEKDAYS_ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Converte "YYYY-MM-DD" em Date local (evita o shift de fuso do Date.parse). */
export function parseEventDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function monthAbbr(date: string): string {
  return MONTHS_ABBR[parseEventDate(date).getMonth()];
}

export function dayOfMonth(date: string): string {
  return String(parseEventDate(date).getDate()).padStart(2, "0");
}

export function weekdayAbbr(date: string): string {
  return WEEKDAYS_ABBR[parseEventDate(date).getDay()];
}

/** Extrai o horário de início de uma faixa "19:15 - 22:30". */
export function startTimeOf(time: string): string {
  return time.split("-")[0].trim();
}

/** Meia-noite de hoje (para comparações apenas por dia). */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isSameDay(date: string, reference: Date): boolean {
  const eventDate = parseEventDate(date);
  return (
    eventDate.getFullYear() === reference.getFullYear() &&
    eventDate.getMonth() === reference.getMonth() &&
    eventDate.getDate() === reference.getDate()
  );
}

/** Ordena eventos por data crescente (não muta o array original). */
export function sortByDate(events: ScheduleEventDto[]): ScheduleEventDto[] {
  return [...events].sort(
    (a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime(),
  );
}
