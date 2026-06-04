export interface SprintReportApiResponse {
    id: number;
    sprint: string;
    student: string;
    date: string;
    id_project: number;
    predicted_activity: string;
    activity_completed: string;
    problems_encountered: string;
    learned_lessons: string;
    next_steps: string;
}

export type RowStatus = "ENVIANDO" | "ENVIADO";

export interface SprintReportRow extends SprintReportApiResponse {
    status: RowStatus;
}

export interface SprintReportPayload {
    sprint: number;
    predictedActivity: string;
    activityCompleted: string;
    problemsEncountered: string;
    learnedLessons: string;
    nextSteps: string;
}

export interface SprintReportFormData {
    project: string;
    sprint: string;
    plannedActivities: string;
    completedActivities: string;
    problems: string;
    lessonsLearned: string;
    nextSteps: string;
}