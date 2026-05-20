export interface AttendanceSlot {
  time: string;
  status: "Presente" | "Ausente";
}

export interface AttendanceDay {
  date: string;
  slots: AttendanceSlot[];
}

export const mockAttendanceData: AttendanceDay[] = [
  {
    date: "13 de Março",
    slots: [
      { time: "19:15 - 20:45", status: "Presente" },
      { time: "21:00 - 22:30", status: "Presente" },
    ],
  },
  {
    date: "20 de Março",
    slots: [
      { time: "19:15 - 20:45", status: "Ausente" },
      { time: "21:00 - 22:30", status: "Ausente" },
    ],
  },
  {
    date: "27 de Março",
    slots: [
      { time: "19:15 - 20:45", status: "Presente" },
      { time: "21:00 - 22:30", status: "Presente" },
    ],
  },
  {
    date: "3 de Abril",
    slots: [
      { time: "19:15 - 20:45", status: "Presente" },
      { time: "21:00 - 22:30", status: "Ausente" },
    ],
  },
  {
    date: "10 de Abril",
    slots: [
      { time: "19:15 - 20:45", status: "Presente" },
      { time: "21:00 - 22:30", status: "Presente" },
    ],
  },
];
