import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal/Modal";

interface SprintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SprintReportFormData) => void;
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

export function SprintReportModal({
  isOpen,
  onClose,
  onSubmit,
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

  const isFormValid = Boolean(
    sprint.trim() &&
    plannedActivities.trim() &&
    completedActivities.trim() &&
    problems.trim() &&
    lessonsLearned.trim() &&
    nextSteps.trim(),
  );

  const handleSubmit = () => {
    if (!isFormValid) return;

    // TODO: integrar com endpoint real de relatório de sprint quando o backend estiver pronto
    onSubmit?.({
      project: DEFAULT_PROJECT,
      sprint,
      plannedActivities,
      completedActivities,
      problems,
      lessonsLearned,
      nextSteps,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Relatório de Sprint">
      <div className="mt-4 flex max-h-[70vh] flex-col">
        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#374151]">
                Projeto*
              </label>

              <input
                value={DEFAULT_PROJECT}
                disabled
                className="
                  h-[42px] w-full rounded-lg border border-[#e5e7eb]
                  bg-[#f9fafb] px-3 text-sm text-[#6b7280]
                "
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#374151]">
                Sprint*
              </label>

              <select
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                className="
                  h-[42px] w-full rounded-lg border border-[#e5e7eb]
                  bg-white px-3 text-sm text-[#374151]
                  focus:outline-none focus:ring-2 focus:ring-[#3b5ccc]/30
                "
              >
                <option value="">Selecione</option>
                <option value="Sprint 1">Sprint 1</option>
                <option value="Sprint 2">Sprint 2</option>
                <option value="Sprint 3">Sprint 3</option>
                <option value="Sprint 4">Sprint 4</option>
                <option value="Sprint 5">Sprint 5</option>
              </select>
            </div>
          </div>

          <TextAreaField
            label="Atividades Previstas*"
            value={plannedActivities}
            onChange={setPlannedActivities}
          />

          <TextAreaField
            label="Atividades Concluídas*"
            value={completedActivities}
            onChange={setCompletedActivities}
          />

          <TextAreaField
            label="Problemas Encontrados*"
            value={problems}
            onChange={setProblems}
          />

          <TextAreaField
            label="Lições Aprendidas*"
            value={lessonsLearned}
            onChange={setLessonsLearned}
          />

          <TextAreaField
            label="Próximos Passos*"
            value={nextSteps}
            onChange={setNextSteps}
          />
        </div>

        <div className="mt-4 flex justify-end gap-3 border-t border-[#e5e7eb] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg border border-[#e5e7eb]
              px-5 py-2 text-sm font-medium text-[#374151]
              hover:bg-[#f9fafb]
              transition-colors cursor-pointer
            "
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="
              rounded-lg bg-[#f97316]
              px-5 py-2 text-sm font-medium text-white
              hover:bg-[#ea580c]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Cadastrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function TextAreaField({ label, value, onChange }: TextAreaFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#374151]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="
          w-full rounded-lg border border-[#e5e7eb]
          px-3 py-2 text-sm text-[#374151]
          resize-none
          focus:outline-none focus:ring-2 focus:ring-[#3b5ccc]/30
        "
      />
    </div>
  );
}
