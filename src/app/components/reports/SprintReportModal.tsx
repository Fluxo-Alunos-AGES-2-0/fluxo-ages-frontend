import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal/Modal";
import { Button } from "../ui/Button/Button";
import { TextArea } from "../ui/TextArea/TextArea";
import { SprintReportFormData, SprintReportRow } from "@/app/types/sprintReport";

interface SprintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SprintReportFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  usedSprints?: string[];
  initialData?: SprintReportRow | null;
}

const DEFAULT_PROJECT = "Fluxo AGES 2.0 - Alunos";
const SPRINT_OPTIONS = [
  "Sprint 1",
  "Sprint 2",
  "Sprint 3",
  "Sprint 4",
  "Sprint 5",
];

export function SprintReportModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  usedSprints = [],
  initialData = null,
}: SprintReportModalProps) {
  const [sprint, setSprint] = useState("");
  const [plannedActivities, setPlannedActivities] = useState("");
  const [completedActivities, setCompletedActivities] = useState("");
  const [problems, setProblems] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSprint(initialData?.sprint ?? "");
      setPlannedActivities(initialData?.predicted_activity ?? "");
      setCompletedActivities(initialData?.activity_completed ?? "");
      setProblems(initialData?.problems_encountered ?? "");
      setLessonsLearned(initialData?.learned_lessons ?? "");
      setNextSteps(initialData?.next_steps ?? "");
    } else {
      setSprint("");
      setPlannedActivities("");
      setCompletedActivities("");
      setProblems("");
      setLessonsLearned("");
      setNextSteps("");
    }
  }, [isOpen, initialData]);

  const usedSet = new Set(usedSprints);
  const availableSprints = SPRINT_OPTIONS.filter((s) => !usedSet.has(s));

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
      project: DEFAULT_PROJECT,
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
      title={initialData ? "Atualizar Relatório de Sprint" : "Relatório de Sprint"}
      className="!w-[550px] !max-w-[550px]"
    >
      <div className="mt-4 flex h-[640px] max-h-[70vh] max-w-full flex-col">
        <div
          className="
            flex flex-col gap-4 overflow-y-auto pr-2
            scrollbar-thin
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-thumb]:bg-slate-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-track]:bg-transparent
            hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
          "
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#6B7280]">
                Projeto*
              </label>

              <input
                value={DEFAULT_PROJECT}
                disabled
                className="h-[42px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#6B7280]">
                Sprint*
              </label>

              <select
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                disabled={!!initialData}
                className="h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                <option value="">Selecione</option>
                {SPRINT_OPTIONS.map((s) => (
                  <option key={s} value={s} disabled={usedSet.has(s)}>
                    {s}
                    {usedSet.has(s) ? " (já enviada)" : ""}
                  </option>
                ))}
              </select>
              {!initialData && availableSprints.length === 0 && (
                <span className="mt-1 block text-xs text-slate-500">
                  Todas as sprints já possuem relatório.
                </span>
              )}
            </div>
          </div>

          <TextArea
            label="Atividades Previstas*"
            value={plannedActivities}
            onChange={setPlannedActivities}
          />

          <TextArea
            label="Atividades Concluídas*"
            value={completedActivities}
            onChange={setCompletedActivities}
          />

          <TextArea
            label="Problemas Encontrados*"
            value={problems}
            onChange={setProblems}
          />

          <TextArea
            label="Lições Aprendidas*"
            value={lessonsLearned}
            onChange={setLessonsLearned}
          />

          <TextArea
            label="Próximos Passos*"
            value={nextSteps}
            onChange={setNextSteps}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e5e7eb] pt-4">
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : initialData ? "Atualizar Relatório" : "Cadastrar"}
          </Button>

          <Button variant="accent-secondary" onClick={onClose} disabled={isSubmitting}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
