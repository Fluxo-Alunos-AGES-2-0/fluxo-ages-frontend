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

export interface HoursData {
    completedSeconds: number;
    remainingSeconds: number;
    totalSeconds: number;
    percentual: number;
}

export interface DashboardResponse {
    profile: ProfileData;
    hours: HoursData;
}