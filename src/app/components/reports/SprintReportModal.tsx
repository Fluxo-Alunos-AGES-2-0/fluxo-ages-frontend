import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal/Modal";
import { Button } from "../ui/Button/Button";
import { TextArea } from "../ui/TextArea/TextArea";
import { Select } from "../ui/Select/Select";
import { InputField } from "../ui/InputField/InputField";

interface SprintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SprintReportFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  usedSprints?: string[];
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
}: SprintReportModalProps) {
  const [sprint, setSprint] = useState("");
  const [plannedActivities, setPlannedActivities] = useState("");
  const [completedActivities, setCompletedActivities] = useState("");
  const [problems, setProblems] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSprint("");
      setPlannedActivities("");
      setCompletedActivities("");
      setProblems("");
      setLessonsLearned("");
      setNextSteps("");
    }
  }, [isOpen]);

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
      title="Relatório de Sprint"
      className="!max-w-2xl"
    >
      <div className="mt-4 flex max-h-[70vh] w-[640px] max-w-full flex-col">
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
            {
            <InputField label="Projeto" disabled={true} value={DEFAULT_PROJECT} mandatory={true} />
            }
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#6B7280]">
                Sprint<span className="text-[#f47b20]">*</span>
              </label>

              <Select
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                placeholder="Selecione"
                wrapperClassName="w-full"
                className="w-full h-[42px] rounded-2xl" 
                options={SPRINT_OPTIONS.map((s) => ({
                  value: s,
                  label: usedSet.has(s) ? `${s} (já enviada)` : s,
                  disabled: usedSet.has(s),
                }))}
              />
              
              {availableSprints.length === 0 && (
                <span className="mt-1 block text-xs text-slate-500">
                  Todas as sprints já possuem relatório.
                </span>
              )}
            </div>
          </div>

          <TextArea
            label="Atividades Previstas"
            value={plannedActivities}
            onChange={setPlannedActivities}
            mandatory={true}
          />

          <TextArea
            label="Atividades Concluídas"
            value={completedActivities}
            onChange={setCompletedActivities}
            mandatory={true}
          />

          <TextArea
            label="Problemas Encontrados"
            value={problems}
            onChange={setProblems}
            mandatory={true}
          />

          <TextArea
            label="Lições Aprendidas"
            value={lessonsLearned}
            onChange={setLessonsLearned}
            mandatory={true}
          />

          <TextArea
            label="Próximos Passos"
            value={nextSteps}
            onChange={setNextSteps}
            mandatory={true}
          />
        </div>

        <div className="mt-8 flex items-center gap-4 w-full">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
            className="!bg-[#f47b20]"
          >
            {isSubmitting ? "Enviando..." : "Cadastrar"}
          </Button>

          <Button 
            variant="secondary" 
            fullWidth
            onClick={onClose} 
            disabled={isSubmitting}
            className="!border-[#e5e7eb] !text-[#f47b20] !bg-transparent"
          >
            Fechar
          </Button>
        </div>

      </div>
    </Modal>
  );
}
