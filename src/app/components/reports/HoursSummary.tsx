interface HourEntry {
  sessionTimeSeconds: number;
}

interface HoursSummaryProps {
  data: HourEntry[];
  totalHours?: number;
  isCurrentProject?: boolean;
}

export function HoursSummary({
  data,
  totalHours = 60,
  isCurrentProject = true,
}: HoursSummaryProps) {
  const totalSeconds = totalHours * 3600;
  const doneSeconds = data.reduce(
    (acc, item) => acc + (item.sessionTimeSeconds ?? 0),
    0,
  );
  const remainingSeconds = Math.max(totalSeconds - doneSeconds, 0);

  if (!isCurrentProject) {
    return (
      <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-[#3b5ccc]">
        <span className="font-semibold">{formatHours(doneSeconds)} concluídas</span>{" "}
        de {formatHours(totalSeconds)} totais.
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-[#3b5ccc]">
      <span className="font-semibold">
        {formatHours(doneSeconds)} concluídas
      </span>{" "}
      de {formatHours(totalSeconds)} totais —{" "}
      <span className="font-semibold">
        {formatHours(remainingSeconds)} restantes
      </span>{" "}
      para concluir.
    </div>
  );
}

function formatHours(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}