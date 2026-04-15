export interface ScheduleEvent {
  id: string;
  dayAbbr: string;
  time: string;
  title: string;
  isToday: boolean;
}

export const mockSchedule: ScheduleEvent[] = [
  {
    id: "1",
    dayAbbr: "Qui",
    time: "19:00",
    title: "Sprint Review",
    isToday: true,
  },
  {
    id: "2",
    dayAbbr: "Sex",
    time: "08:30",
    title: "Retrospectiva",
    isToday: false,
  },
  {
    id: "3",
    dayAbbr: "Seg",
    time: "08:00",
    title: "Daily Standup",
    isToday: false,
  },
  {
    id: "4",
    dayAbbr: "Seg",
    time: "14:00",
    title: "Sprint Planning",
    isToday: false,
  },
];
