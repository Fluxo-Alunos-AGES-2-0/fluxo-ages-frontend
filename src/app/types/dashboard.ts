export interface ProfileData {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  agesLevel: number;
  currentProject: { id: number; name: string } | null;
  professor: { id: number; name: string } | null;
  attendance: {
    totalClasses: number;
    presences: number;
    absences: number;
  };
}

export type AttendanceStatus = "PRESENTE" | "AUSENTE" | "ABONADO";

export interface AttendanceHistorySlot {
  time: string;
  status: AttendanceStatus;
}

export interface AttendanceHistoryDay {
  date: string;
  slots: AttendanceHistorySlot[];
}

export interface AttendanceHistoryResponse {
  days: AttendanceHistoryDay[];
}

export interface HoursData {
  completedSeconds: number;
  remainingSeconds: number;
  totalSeconds: number;
  owingSeconds: number;
  percentual: number;
}

export interface DashboardResponse {
  profile: ProfileData;
  hours: HoursData;
}
