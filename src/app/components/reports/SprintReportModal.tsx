import { useEffect, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Modal } from "../ui/Modal/Modal";
import { Button } from "../ui/Button/Button";
import { TextArea } from "../ui/TextArea/TextArea";
import { Select } from "../ui/Select/Select";
import { InputField } from "../ui/InputField/InputField";
import {
    SprintReportFormData,
    SprintReportRow,
} from "@/app/types/sprintReport";

interface SprintReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: SprintReportFormData) => void | Promise<void>;
    isSubmitting?: boolean;
    usedSprints?: string[];
    initialData?: SprintReportRow | null;
    projectName?: string;
}

const DEFAULT_PROJECT = "Fluxo AGES 2.0 - Alunos";
const SPRINT_OPTIONS = [
    "Sprint 0",
    "Sprint 1",
    "Sprint 2",
    "Sprint 3",
    "Sprint 4",
];

export function SprintReportModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    usedSprints = [],
    initialData = null,
    projectName = DEFAULT_PROJECT,
}: SprintReportModalProps) {
    const { theme } = useTheme();
    const [sprint, setSprint] = useState("");
    const [plannedActivities, setPlannedActivities] = useState("");
    const [completedActivities, setCompletedActivities] = useState("");
    const [problems, setProblems] = useState("");
    const [lessonsLearned, setLessonsLearned] = useState("");
    const [nextSteps, setNextSteps] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsEditing(!!initialData);
            setSprint(initialData?.sprint ?? "");
            setPlannedActivities(initialData?.predicted_activity ?? "");
            setCompletedActivities(initialData?.activity_completed ?? "");
            setProblems(initialData?.problems_encountered ?? "");
            setLessonsLearned(initialData?.learned_lessons ?? "");
            setNextSteps(initialData?.next_steps ?? "");
        }
    }, [isOpen, initialData]);

    const usedSet = new Set(usedSprints);
    const availableSprints = SPRINT_OPTIONS.filter((option) => !usedSet.has(option));
    const isDarkTheme = theme === "dark";

    const isFormValid = Boolean(
        sprint.trim() &&
        plannedActivities.trim() &&
        completedActivities.trim() &&
        problems.trim() &&
        lessonsLearned.trim() &&
        nextSteps.trim(),
    );

    const handleSubmit = () => {
        if (!isFormValid || isSubmitting) return;

        onSubmit?.({
            project: projectName,
            sprint,
            plannedActivities,
            completedActivities,
            problems,
            lessonsLearned,
            nextSteps,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Atualizar Relatorio de Sprint" : "Relatorio de Sprint"}
            className="!max-w-2xl dark:bg-[#1E293B] dark:text-[#F4F6F7] dark:border-[#31405A]"
        >
            <div className="mt-4 flex max-h-[70vh] w-[640px] max-w-full flex-col">
                <div
                    className="
            flex flex-col gap-4 overflow-y-auto pr-2
            scrollbar-thin
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-thumb]:bg-slate-200
            dark:[&::-webkit-scrollbar-thumb]:bg-[#64748B]
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-track]:bg-transparent
            hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
            dark:hover:[&::-webkit-scrollbar-thumb]:bg-[#94A3B8]
            dark:text-[#F4F6F7]
          "
                >
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Projeto"
                            disabled
                            value={projectName}
                            mandatory
                        />

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8]">
                                Sprint<span className="text-[#f47b20]">*</span>
                            </label>

                            <Select
                                value={sprint}
                                onChange={(e) => setSprint(e.target.value)}
                                disabled={isEditing}
                                placeholder="Selecione"
                                wrapperClassName="w-full"
                                className="w-full h-[42px] rounded-2xl dark:bg-[#0F172A] dark:text-[#F4F6F7] dark:border-[#334155] dark:placeholder:text-[#94A3B8]"
                                options={SPRINT_OPTIONS.map((option) => {
                                    const isUsed = usedSet.has(option);

                                        return {
                                            value: option,
                                            label: option,
                                            disabled: isUsed,
                                            title: isUsed
                                                ? "Sprint com relatorio ja cadastrado"
                                            : undefined,
                                        style: isUsed
                                            ? {
                                                backgroundColor: isDarkTheme
                                                    ? "#334155"
                                                    : "#cbd5e1",
                                                color: isDarkTheme
                                                    ? "#f8fafc"
                                                    : "#334155",
                                                fontWeight: 700,
                                            }
                                            : undefined,
                                    };
                                })}
                            />

                            {!isEditing && availableSprints.length === 0 && (
                                <span className="mt-1 block text-xs text-slate-500 dark:text-[#94A3B8]">
                                    Todas as sprints ja possuem relatorio.
                                </span>
                            )}
                        </div>
                    </div>

                    <TextArea
                        label="Atividades Previstas"
                        value={plannedActivities}
                        onChange={setPlannedActivities}
                        mandatory
                    />

                    <TextArea
                        label="Atividades Concluidas"
                        value={completedActivities}
                        onChange={setCompletedActivities}
                        mandatory
                    />

                    <TextArea
                        label="Problemas Encontrados"
                        value={problems}
                        onChange={setProblems}
                        mandatory
                    />

                    <TextArea
                        label="Licoes Aprendidas"
                        value={lessonsLearned}
                        onChange={setLessonsLearned}
                        mandatory
                    />

                    <TextArea
                        label="Proximos Passos"
                        value={nextSteps}
                        onChange={setNextSteps}
                        mandatory
                    />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Button
                        variant="accent-secondary"
                        fullWidth
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Fechar
                    </Button>

                    <Button
                        variant="accent"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                        loading={isSubmitting}
                    >
                        {isSubmitting
                            ? "Enviando..."
                            : isEditing
                                ? "Atualizar Relatorio"
                                : "Cadastrar"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
