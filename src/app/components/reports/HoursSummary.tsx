export function HoursSummary({ data }: { data: any[] }) {
  const totalSeconds = 60 * 60 * 60; // 60h
  const doneSeconds = data.reduce(
    (acc, item) => acc + (item.totalTimeSeconds ?? 0),
    0
  );
  const remainingSeconds = Math.max(totalSeconds - doneSeconds, 0);

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
  return `${h}h`;
}